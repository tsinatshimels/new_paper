document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Quill Customization: Register custom formats ---
  const Parchment = Quill.import("parchment");
  // For right margin
  const RightIndent = new Parchment.Attributor.Style(
    "right-indent",
    "margin-right",
    { scope: Parchment.Scope.BLOCK }
  );
  // For first-line indent
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

  let activeEditor = paperEditors[0];
  const PIXELS_PER_INCH = 96;
  const INDENT_WIDTH_PX = 40; // How many pixels one Quill indent level is

  // --- 3. Toggle Ruler Visibility ---
  toggleBtn.addEventListener("click", () => {
    const isVisible = rulerSystem.style.display === "block";
    rulerSystem.style.display = isVisible ? "none" : "block";
    if (!isVisible) {
      generateRulerMarks();
      updateRulerMarkers(activeEditor);
    }
  });

  // --- 4. Generate Ruler Ticks and Numbers ---
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

    const formats = editor.getFormat(selection.index) || {};
    const indentPx = (formats.indent || 0) * INDENT_WIDTH_PX;
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

      const startX = e.clientX;
      const rulerRect = hRuler.getBoundingClientRect();

      const onMouseMove = (moveEvent) => {
        let newX = moveEvent.clientX;
        let newPos = newX - rulerRect.left; // Position relative to the ruler

        // Constrain position within the ruler bounds
        newPos = Math.max(0, newPos);
        newPos = Math.min(rulerRect.width, newPos);

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

  // Assign drag handlers to each marker
  createDragHandler(leftIndentMarker, (newPos) => {
    const newIndentLevel = Math.round(newPos / INDENT_WIDTH_PX);
    activeEditor.format("indent", newIndentLevel);
    updateRulerMarkers(activeEditor);
  });

  createDragHandler(firstLineMarker, (newPos) => {
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
