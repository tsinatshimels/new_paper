// quill.ruler.js (Final Version with Separated Drawing and Real Scale)

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DOM Element References ---
  const mainWhitePaperBoard = document.getElementById("main_white_paper_board");
  const rulerSystem = document.getElementById("ruler-system-wrapper");
  const toggleRulerBtn = document.getElementById("toggle-ruler-btn");
  const hRuler = document.getElementById("horizontal-ruler");
  const vRuler = document.getElementById("vertical-ruler");
  const hRulerMarks = document.getElementById("h-ruler-marks");
  const vRulerMarks = document.getElementById("v-ruler-marks");
  const leftIndentMarker = document.getElementById("left-indent-marker");
  const rightIndentMarker = document.getElementById("right-indent-marker");
  const editorContainer = document.getElementById("editor-container");
  const editorPaperWrapper = document.getElementById("editor_paper--wrapper");
  const caretRulerLine = document.getElementById("caret-ruler-line");
  const caretRulerTooltip = document.getElementById("caret-ruler-tooltip");
  const matchingSlider = document.getElementById("matching_slider");
  if (!rulerSystem || !toggleRulerBtn) {
    console.error("Ruler system base elements not found.");
    return;
  }

  // --- 2. State and Constants ---
  const PIXELS_PER_INCH = 96;
  const INDENT_WIDTH_PX = 48;

  // -- THIS IS THE FIX: SEPARATE THE SCALES --
  // This scale is ONLY for drawing the ruler marks with the desired small gaps. It never changes.
  const RULER_DRAWING_SCALE = 0.37;
  // This will hold the real, live scale of the paper for accurate calculations.
  let realCurrentScale = RULER_DRAWING_SCALE;

  let isRulerVisible = false;

  // --- 3. Quill Integration ---
  const Parchment = Quill.import("parchment");
  Quill.register(
    new Parchment.Attributor.Style("right-indent", "margin-right", {
      scope: Parchment.Scope.BLOCK,
    })
  );
  Quill.register(
    new Parchment.Attributor.Style("text-indent", "text-indent", {
      scope: Parchment.Scope.BLOCK,
    })
  );

  const getQlEditorMetrics = () => {
    const qlEditor = editorPaperWrapper.querySelector(".ql-editor");
    if (!qlEditor) return { left: 0, right: 0, width: 0, rect: null };
    const rect = qlEditor.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(qlEditor);

    const transform = window.getComputedStyle(
      qlEditor.closest(".editor_paper")
    ).transform;

    // This function now only updates the REAL scale for calculations.
    if (transform && transform !== "none") {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      realCurrentScale = matrix ? parseFloat(matrix[1].split(", ")[0]) : 1;
    } else {
      // If no transform is found, assume it might be 1 for calculations
      realCurrentScale = 1;
    }

    return {
      left: parseFloat(computedStyle.paddingLeft),
      right: parseFloat(computedStyle.paddingRight),
      width: rect.width,
      rect: rect,
    };
  };

  // --- 4. Ruler Update Logic ---
  function fullRulerUpdate() {
    if (!isRulerVisible) return;
    getQlEditorMetrics(); // Update the real scale first
    const mainBoardWidth = mainWhitePaperBoard.clientWidth;
    hRuler.style.width = `${mainBoardWidth - 30}px`;
    vRuler.style.height = `${editorContainer.clientHeight}px`;
    generateRulerMarks();
    updateRulerMarkers();
  }

  function generateRulerMarks() {
    hRulerMarks
      .querySelectorAll(".ruler-mark, .ruler-number")
      .forEach((el) => el.remove());
    vRulerMarks.innerHTML = "";

    const SUBDIVISIONS_PER_INCH = 4;
    const increment = PIXELS_PER_INCH / SUBDIVISIONS_PER_INCH;
    const maxRulerWidthInPixels = 16 * PIXELS_PER_INCH;

    for (let i = 0; i <= maxRulerWidthInPixels; i += increment) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";
      // This now CONSISTENTLY uses the drawing scale for visual appearance.
      mark.style.left = `${i * RULER_DRAWING_SCALE}px`;
      if (i % PIXELS_PER_INCH === 0) {
        mark.classList.add("major");
        const num = document.createElement("span");
        num.className = "ruler-number";
        num.textContent = i / PIXELS_PER_INCH;
        num.style.left = `${i * RULER_DRAWING_SCALE}px`;
        hRulerMarks.appendChild(num);
      } else if (i % (PIXELS_PER_INCH / 2) === 0) {
        mark.classList.add("half-inch");
      }
      hRulerMarks.appendChild(mark);
    }

    // Vertical Ruler Marks
    for (let i = 0; i <= 1600; i += increment) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";
      mark.style.top = `${i * RULER_DRAWING_SCALE}px`;

      if (i % PIXELS_PER_INCH === 0) {
        mark.classList.add("major");
        const num = document.createElement("span");
        num.className = "ruler-number";
        num.textContent = Math.round(i / PIXELS_PER_INCH);
        num.style.top = `${i * RULER_DRAWING_SCALE}px`;
        vRulerMarks.appendChild(num);
      } else if (i % (PIXELS_PER_INCH / 2) === 0) {
        mark.classList.add("half-inch");
      }

      vRulerMarks.appendChild(mark);
    }
  }

  function updateRulerMarkers() {
    if (!window.focusedEditor || !isRulerVisible) return;
    const selection = window.focusedEditor.getSelection();
    if (!selection) return;
    const formats = window.focusedEditor.getFormat(selection.index) || {};
    const {
      left: paddingLeft,
      right: paddingRight,
      width: scaledWidth,
      rect: paperRect,
    } = getQlEditorMetrics();
    const rulerRect = hRuler.getBoundingClientRect();
    hRulerMarks.style.left = `${paperRect.left - rulerRect.left}px`;
    const indentPx = (formats.indent || 0) * INDENT_WIDTH_PX;
    const textIndentPx = parseFloat(formats["text-indent"] || "0px");
    const rightIndentPx = parseFloat(formats["right-indent"] || "0px");

    // Marker positioning must use the REAL, live scale.
    leftIndentMarker.style.left = `${
      (paddingLeft + indentPx) * realCurrentScale
    }px`;
    rightIndentMarker.style.left = `${
      scaledWidth - (paddingRight + rightIndentPx) * realCurrentScale
    }px`;
  }

  // --- 5. DRAGGING LOGIC ---
  function createDragHandler(markerElement, type) {
    markerElement.addEventListener("mousedown", (e) => {
      if (!window.focusedEditor) return;
      e.preventDefault();
      e.stopPropagation();
      const dragStartX = e.pageX;
      const initialMarkerLeft = parseFloat(markerElement.style.left || "0");
      caretRulerLine.style.height = `${editorContainer.clientHeight}px`;
      caretRulerLine.classList.add("active");
      document.body.classList.add("dragging-ew-resize");

      const onMouseMove = (moveEvent) => {
        requestAnimationFrame(() => {
          const deltaX = moveEvent.pageX - dragStartX;
          const newMarkerLeft = initialMarkerLeft + deltaX;
          markerElement.style.left = `${newMarkerLeft}px`;
          const markerRect = markerElement.getBoundingClientRect();
          const rulerSystemRect = rulerSystem.getBoundingClientRect();
          caretRulerLine.style.left = `${
            markerRect.left - rulerSystemRect.left + markerRect.width / 2
          }px`;
          caretRulerLine.style.display = "block";

          // Tooltip calculation must use the REAL, live scale.
          const inchValue = newMarkerLeft / realCurrentScale / PIXELS_PER_INCH;
          caretRulerTooltip.textContent = `${inchValue.toFixed(2)}"`;
        });
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.classList.remove("dragging-ew-resize");
        caretRulerLine.style.display = "none";
        caretRulerLine.classList.remove("active");

        // Final position calculation must use the REAL, live scale.
        const {
          left: paddingLeft,
          right: paddingRight,
          width: scaledWidth,
        } = getQlEditorMetrics();
        const finalLeft =
          parseFloat(markerElement.style.left) / realCurrentScale;

        switch (type) {
          case "left-indent": {
            const newIndentPx = Math.max(0, finalLeft - paddingLeft);
            const newIndentLevel = Math.round(newIndentPx / INDENT_WIDTH_PX);
            window.focusedEditor.format("indent", newIndentLevel, "user");
            break;
          }
          case "right-indent": {
            const contentWidth =
              scaledWidth / realCurrentScale - paddingLeft - paddingRight;
            const newRightIndentPx = Math.max(0, contentWidth - finalLeft);
            window.focusedEditor.format(
              "right-indent",
              `${newRightIndentPx}px`,
              "user"
            );
            break;
          }
        }
        setTimeout(updateRulerMarkers, 50);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  createDragHandler(leftIndentMarker, "left-indent");
  createDragHandler(rightIndentMarker, "right-indent");

  // --- 6. Event Listeners ---
  const editorUpdateHandler = () => {
    if (isRulerVisible) updateRulerMarkers();
  };

  function attachQuillListeners() {
    if (window.focusedEditor) {
      window.focusedEditor.on("selection-change", editorUpdateHandler);
      window.focusedEditor.on("text-change", editorUpdateHandler);
      // Don't call fullRulerUpdate here automatically, wait for toggle.
    } else {
      setTimeout(attachQuillListeners, 500);
    }
  }

  toggleRulerBtn.addEventListener("click", () => {
    isRulerVisible = !isRulerVisible;
    rulerSystem.style.display = isRulerVisible ? "block" : "none";
    if (isRulerVisible) {
      fullRulerUpdate();
      matchingSlider.style.margin = "30px";
    } else {
      matchingSlider.style.margin = "0px";
    }
  });

  // --- Initial Setup ---
  attachQuillListeners();
  new ResizeObserver(fullRulerUpdate).observe(mainWhitePaperBoard);
});
