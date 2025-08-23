document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DOM Element References ---
  const rulerSystem = document.getElementById("ruler-system-wrapper");
  const toggleBtn = document.getElementById("toggle-ruler-btn");
  const hRuler = document.getElementById("horizontal-ruler");
  const vRuler = document.getElementById("vertical-ruler");
  const hRulerMarks = document.getElementById("h-ruler-marks");
  const vRulerMarks = document.getElementById("v-ruler-marks");
  const leftIndentMarker = document.getElementById("left-indent-marker");
  const firstLineMarker = document.getElementById("first-line-marker");
  const rightIndentMarker = document.getElementById("right-indent-marker");
  const paperContainer = document.querySelector(".paper-editor");

  if (!rulerSystem || !paperContainer) {
    console.error("Ruler or Paper Editor element not found.");
    return;
  }

  // --- 2. State and Constants ---
  const RULER_LEFT_OFFSET = 75; // Space for vertical ruler
  let activeEditor = paperEditors[0];
  let currentScale = 1;
  const PIXELS_PER_INCH = 96;

  // --- 3. Quill and Indent Setup (No Changes) ---
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

  // --- 4. Main Update and Drawing Functions ---

  function generateRulerMarks() {
    hRulerMarks.innerHTML = "";
    vRulerMarks.innerHTML = "";

    const paperWidth = paperContainer.clientWidth;
    const paperHeight = paperContainer.clientHeight;

    // Calculate the VISUAL dimensions of the paper after scaling
    const scaledPaperWidth = paperWidth * currentScale;
    const scaledPaperHeight = paperHeight * currentScale;

    // --- THIS IS THE FIX ---
    // Set the ruler elements' actual width/height to match the scaled paper.
    // This makes the ruler's background stretch to contain all the marks and markers.
    rulerSystem.style.width = `${scaledPaperWidth + RULER_LEFT_OFFSET}px`;
    hRuler.style.width = `${scaledPaperWidth}px`;
    vRuler.style.height = `${scaledPaperHeight}px`;
    // --- END OF FIX ---

    // This represents how many pixels on the screen make up one "ruler inch"
    const pixelsPerInchOnScreen = PIXELS_PER_INCH * currentScale;

    // Generate Horizontal Marks across the new, larger, scaled width
    for (let i = 0; i < scaledPaperWidth; i += pixelsPerInchOnScreen / 16) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";

      // Calculate the true inch value for labeling and tick size
      const inchValue = i / pixelsPerInchOnScreen;

      // Use a small tolerance for floating point comparisons
      if (Math.abs(inchValue % 1) < 0.001) mark.classList.add("major");
      else if (Math.abs(inchValue % 0.5) < 0.001) mark.classList.add("minor");

      mark.style.left = `${i}px`;
      hRulerMarks.appendChild(mark);

      if (Math.abs(inchValue % 1) < 0.001 && i > 0) {
        const number = document.createElement("span");
        number.className = "ruler-number";
        number.textContent = Math.round(inchValue);
        number.style.left = `${i}px`;
        hRulerMarks.appendChild(number);
      }
    }

    // Generate Vertical Marks down the new, taller, scaled height
    for (let i = 0; i < scaledPaperHeight; i += pixelsPerInchOnScreen / 16) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";
      const inchValue = i / pixelsPerInchOnScreen;
      if (Math.abs(inchValue % 1) < 0.001) mark.classList.add("major");
      else if (Math.abs(inchValue % 0.5) < 0.001) mark.classList.add("minor");
      mark.style.top = `${i}px`;
      vRulerMarks.appendChild(mark);
      if (Math.abs(inchValue % 1) < 0.001 && i > 0) {
        const number = document.createElement("span");
        number.className = "ruler-number";
        number.textContent = Math.round(inchValue);
        number.style.top = `${i}px`;
        vRulerMarks.appendChild(number);
      }
    }
  }

  function updateRulerMarkers() {
    if (!activeEditor) return;
    const selection = activeEditor.getSelection();
    if (!selection) return;
    const formats = activeEditor.getFormat(selection.index) || {};
    const INDENT_WIDTH_PX = IndentMeasurer.getWidth();
    const indentPx = (formats.indent || 0) * INDENT_WIDTH_PX;
    const textIndentPx = parseFloat(formats["text-indent"] || "0px");
    const rightIndentPx = parseFloat(formats["right-indent"] || "0px");
    const rulerWidth = paperContainer.clientWidth;

    // Apply scale to the positions
    leftIndentMarker.style.left = `${10 + indentPx * currentScale}px`;
    firstLineMarker.style.left = `${
      (indentPx + textIndentPx) * currentScale
    }px`;
    // Use 'left' for right marker for consistency
    rightIndentMarker.style.left = `${
      (rulerWidth - rightIndentPx) * currentScale - 10
    }px`;
  }

  // --- 5. Drag and Drop Logic ---
  function createDragHandler(marker, onDragUpdate) {
    marker.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const rulerRect = hRuler.getBoundingClientRect();
      const onMouseMove = (moveEvent) => {
        let newPos = moveEvent.clientX - rulerRect.left;
        newPos = Math.max(0, Math.min(newPos, rulerRect.width));
        const unscaledPos = newPos / currentScale; // <-- Crucial: convert back to unscaled
        onDragUpdate(unscaledPos);
      };
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  createDragHandler(leftIndentMarker, (unscaledPos) => {
    const INDENT_WIDTH_PX = IndentMeasurer.getWidth();
    const newIndentLevel = Math.round(unscaledPos / INDENT_WIDTH_PX);
    activeEditor.format("indent", newIndentLevel);
  });
  createDragHandler(firstLineMarker, (unscaledPos) => {
    const INDENT_WIDTH_PX = IndentMeasurer.getWidth();
    const currentIndentPx =
      (activeEditor.getFormat().indent || 0) * INDENT_WIDTH_PX;
    const newTextIndent = unscaledPos - currentIndentPx;
    activeEditor.format("text-indent", `${newTextIndent}px`);
  });
  createDragHandler(rightIndentMarker, (unscaledPos) => {
    const rulerWidth = paperContainer.clientWidth;
    const newRightIndent = rulerWidth - unscaledPos;
    activeEditor.format("right-indent", `${newRightIndent}px`);
  });

  // --- 6. Event Listeners ---
  document.addEventListener("zoomchange", (e) => {
    if (e.detail) {
      currentScale = e.detail.scale;
      // Position the entire ruler system based on info from zoom.js
      rulerSystem.style.left = `${
        90 + (e.detail.paperLeft - RULER_LEFT_OFFSET)
      }px`;
      rulerSystem.style.top = `${e.detail.paperTop}px`; // <-- Use the new top offset
      // Redraw everything
      generateRulerMarks();
      updateRulerMarkers();
    }
  });

  toggleBtn.addEventListener("click", () => {
    const isVisible = rulerSystem.style.display === "block";
    rulerSystem.style.display = isVisible ? "none" : "block";
    if (!isVisible) {
      generateRulerMarks();
      updateRulerMarkers();
    }
  });

  paperEditors.forEach((editor) => {
    const editorChangeHandler = () => {
      activeEditor = editor;
      updateRulerMarkers();
    };
    editor.on("selection-change", editorChangeHandler);
    editor.on("text-change", editorChangeHandler); // Update on text change too
  });
});
