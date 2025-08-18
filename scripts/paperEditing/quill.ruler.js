document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Quill Customization: Register custom formats ---
  const Parchment = Quill.import("parchment");
  const RightIndent = new Parchment.Attributor.Style(
    "right-indent",
    "margin-right",
    { scope: Parchment.Scope.BLOCK }
  );
  const TextIndent = new Parchment.Attributor.Style(
    "text-indent",
    "text-indent",
    { scope: Parchment.Scope.BLOCK }
  );
  Quill.register(RightIndent);
  Quill.register(TextIndent);

  // --- 2. DOM Element References ---
  const rulerSystem = document.getElementById("ruler-system-wrapper");
  const toggleBtn = document.getElementById("toggle-ruler-btn");
  const hRuler = document.getElementById("horizontal-ruler");
  const hRulerMarks = document.getElementById("h-ruler-marks");
  const vRulerMarks = document.getElementById("v-ruler-marks");
  const leftIndentMarker = document.getElementById("left-indent-marker");
  const firstLineMarker = document.getElementById("first-line-marker");
  const rightIndentMarker = document.getElementById("right-indent-marker");
  const paperContainer = document.querySelector(".paper-editor");

  if (!rulerSystem || !paperContainer) {
    console.error(
      "Ruler or Paper Editor element not found. Aborting ruler script."
    );
    return;
  }

  // --- ROBUST, LAZY MEASUREMENT UTILITY ---
  const IndentMeasurer = (() => {
    let cachedWidth = null; // This will store the width after the first measurement

    function measure() {
      const tempEditor = document.createElement("div");
      const tempParagraph = document.createElement("p");

      // We must replicate the structure for styles to apply correctly
      tempEditor.className = "ql-editor";
      tempEditor.style.visibility = "hidden";
      tempEditor.style.position = "absolute";
      tempEditor.style.left = "-9999px";

      tempParagraph.className = "ql-indent-1";
      tempEditor.appendChild(tempParagraph);

      // Append to the actual paper container to inherit all relevant styles (like font-size)
      paperContainer.appendChild(tempEditor);

      const computedStyle = window.getComputedStyle(tempParagraph);
      const indentWidth = parseFloat(computedStyle.paddingLeft);

      paperContainer.removeChild(tempEditor);

      // Add a debug log to see what the browser is measuring
      console.log("Measured Quill indent width:", indentWidth, "px");

      // Use the measurement, or a much more realistic fallback based on a 16px font (16*3=48)
      return indentWidth > 0 ? indentWidth : 48;
    }

    return {
      getWidth: function () {
        if (cachedWidth === null) {
          cachedWidth = measure();
        }
        return cachedWidth;
      },
    };
  })();

  let activeEditor = paperEditors[0];
  const PIXELS_PER_INCH = 96;

  // --- We will get the indent width on-demand later, not here ---

  // --- 3. Toggle Ruler Visibility ---
  toggleBtn.addEventListener("click", () => {
    const isVisible = rulerSystem.style.display === "block";
    rulerSystem.style.display = isVisible ? "none" : "block";
    if (!isVisible) {
      // First time it's visible, generate the marks and update markers
      generateRulerMarks();
      updateRulerMarkers(activeEditor);
    }
  });

  // --- 4. Generate Ruler Ticks and Numbers --- (No changes here)
  function generateRulerMarks() {
    hRulerMarks.innerHTML = "";
    vRulerMarks.innerHTML = "";
    const paperWidth = paperContainer.clientWidth;
    const paperHeight = paperContainer.clientHeight;
    for (let i = 0; i < paperWidth; i += PIXELS_PER_INCH / 16) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";
      if (((i * 16) / PIXELS_PER_INCH) % 8 === 0) mark.classList.add("major");
      else if (((i * 16) / PIXELS_PER_INCH) % 4 === 0)
        mark.classList.add("minor");
      mark.style.left = `${i}px`;
      hRulerMarks.appendChild(mark);
      if (((i * 16) / PIXELS_PER_INCH) % 8 === 0 && i > 0) {
        const number = document.createElement("span");
        number.className = "ruler-number";
        number.textContent = i / PIXELS_PER_INCH;
        number.style.left = `${i}px`;
        hRulerMarks.appendChild(number);
      }
    }
    for (let i = 0; i < paperHeight; i += PIXELS_PER_INCH / 16) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";
      if (((i * 16) / PIXELS_PER_INCH) % 8 === 0) mark.classList.add("major");
      else if (((i * 16) / PIXELS_PER_INCH) % 4 === 0)
        mark.classList.add("minor");
      mark.style.top = `${i}px`;
      vRulerMarks.appendChild(mark);
      if (((i * 16) / PIXELS_PER_INCH) % 8 === 0 && i > 0) {
        const number = document.createElement("span");
        number.className = "ruler-number";
        number.textContent = i / PIXELS_PER_INCH;
        number.style.top = `${i}px`;
        vRulerMarks.appendChild(number);
      }
    }
  }

  // --- 5. Sync Quill Selection with Ruler Markers ---
  function updateRulerMarkers(editor) {
    if (!editor) return;
    const selection = editor.getSelection();
    if (!selection) return;

    const INDENT_WIDTH_PX = IndentMeasurer.getWidth(); // Get the width here
    const formats = editor.getFormat(selection.index) || {};
    // const indentPx = (formats.indent || 0) * INDENT_WIDTH_PX;
    const indentPx = 15 + (formats.indent || 0) * INDENT_WIDTH_PX; // Adjusted to start at 15px

    const textIndentPx = parseFloat(formats["text-indent"] || "0px");
    const rightIndentPx = parseFloat(formats["right-indent"] || "0px");

    leftIndentMarker.style.left = `${indentPx}px`;
    firstLineMarker.style.left = `${indentPx + textIndentPx}px`;
    rightIndentMarker.style.right = `${rightIndentPx}px`;
  }

  // --- 6. Drag and Drop Logic for Markers ---
  function createDragHandler(marker, onDragUpdate) {
    marker.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const rulerRect = hRuler.getBoundingClientRect();
      const onMouseMove = (moveEvent) => {
        let newPos = moveEvent.clientX - rulerRect.left;
        newPos = Math.max(0, Math.min(newPos, rulerRect.width));
        onDragUpdate(newPos);
      };
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  // Assign drag handlers
  createDragHandler(leftIndentMarker, (newPos) => {
    const INDENT_WIDTH_PX = IndentMeasurer.getWidth(); // Get width
    const newIndentLevel = Math.round(newPos / INDENT_WIDTH_PX);
    activeEditor.format("indent", newIndentLevel);
    updateRulerMarkers(activeEditor);
  });

  createDragHandler(firstLineMarker, (newPos) => {
    const INDENT_WIDTH_PX = IndentMeasurer.getWidth(); // Get width
    const currentIndentPx =
      (activeEditor.getFormat().indent || 0) * INDENT_WIDTH_PX;
    const newTextIndent = newPos - currentIndentPx;
    activeEditor.format("text-indent", `${newTextIndent}px`);
    updateRulerMarkers(activeEditor);
  });

  createDragHandler(rightIndentMarker, (newPos) => {
    const rulerWidth = hRuler.clientWidth;
    const newRightIndent = rulerWidth - newPos;
    activeEditor.format("right-indent", `${newRightIndent}px`);
    updateRulerMarkers(activeEditor);
  });

  // --- 7. Connect Everything to Quill Editors ---
  paperEditors.forEach((editor) => {
    editor.on("selection-change", (range, oldRange, source) => {
      if (source === "user" && range) {
        activeEditor = editor;
        updateRulerMarkers(editor);
      }
    });
  });
});
