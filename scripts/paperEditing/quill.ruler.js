// quill.ruler.js (Corrected Drag Logic)

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
  const firstLineMarker = document.getElementById("first-line-marker");
  const rightIndentMarker = document.getElementById("right-indent-marker");
  const editorContainer = document.getElementById("editor-container");
  const editorPaper = document.getElementById("editor_paper");
  const editorPaperWrapper = document.getElementById("editor_paper--wrapper");
  const caretRulerLine = document.getElementById("caret-ruler-line");
  const caretRulerTooltip = document.getElementById("caret-ruler-tooltip");

  if (!rulerSystem || !toggleRulerBtn) {
    console.error("Ruler system base elements not found.");
    return;
  }

  // --- 2. State and Constants ---
  const PIXELS_PER_INCH = 96;
  const INDENT_WIDTH_PX = 48;
  let currentScale = 1;
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
    const mainBoardWidth = mainWhitePaperBoard.clientWidth;
    hRuler.style.width = `${mainBoardWidth - 30}px`;
    vRuler.style.height = `${editorContainer.clientHeight}px`;
    generateRulerMarks();
    updateRulerMarkers();
  }

  function generateRulerMarks() {
    hRulerMarks.innerHTML = "";
    vRulerMarks.innerHTML = "";
    const hRulerWidth = mainWhitePaperBoard.clientWidth;

    for (let i = 0; i < 610; i += PIXELS_PER_INCH / 16) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";
      mark.style.left = `${i * currentScale}px`;
      hRulerMarks.appendChild(mark);
      if (i % PIXELS_PER_INCH === 0) {
        mark.classList.add("major");
        const num = document.createElement("span");
        num.className = "ruler-number";
        num.textContent = i / PIXELS_PER_INCH;
        num.style.left = `${i * currentScale}px`;
        hRulerMarks.appendChild(num);
      }
    }
    for (let i = 0; i <= 500; i += (PIXELS_PER_INCH / 16) * currentScale) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";
      mark.style.top = `${i}px`;
      vRulerMarks.appendChild(mark);
      const inchValue = i / (PIXELS_PER_INCH * currentScale);
      if (Math.abs(inchValue % 1) < 0.01) {
        mark.classList.add("major");
        const num = document.createElement("span");
        num.className = "ruler-number";
        num.textContent = Math.round(inchValue);
        num.style.top = `${i}px`;
        vRulerMarks.appendChild(num);
      } else if (Math.abs(inchValue % 0.5) < 0.01) {
        mark.classList.add("minor");
      }
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
    leftIndentMarker.style.left = `${
      (paddingLeft + indentPx) * currentScale
    }px`;
    firstLineMarker.style.left = `${textIndentPx * currentScale}px`;
    rightIndentMarker.style.left = `${
      scaledWidth - (paddingRight + rightIndentPx) * currentScale
    }px`;
  }

  // --- 5. DRAGGING LOGIC (REFACTORED) ---
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

      // Define move and up handlers *inside* mousedown
      const onMouseMove = (moveEvent) => {
        requestAnimationFrame(() => {
          const deltaX = moveEvent.pageX - dragStartX;
          const newMarkerLeft = initialMarkerLeft + deltaX;
          markerElement.style.left = `${newMarkerLeft}px`;

          const linePosition = hRulerMarks.offsetLeft + newMarkerLeft;
          caretRulerLine.style.left = `${linePosition}px`;
          caretRulerLine.style.display = "block";

          const inchValue = newMarkerLeft / currentScale / PIXELS_PER_INCH;
          caretRulerTooltip.textContent = `${inchValue.toFixed(2)}"`;
        });
      };

      const onMouseUp = () => {
        // Cleanup listeners
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        // Reset UI
        document.body.classList.remove("dragging-ew-resize");
        caretRulerLine.style.display = "none";
        caretRulerLine.classList.remove("active");

        // Apply formatting to Quill
        const {
          left: paddingLeft,
          right: paddingRight,
          width: scaledWidth,
        } = getQlEditorMetrics();
        const finalLeft = parseFloat(markerElement.style.left) / currentScale;

        switch (type) {
          case "left-indent": {
            const newIndentPx = Math.max(0, finalLeft - paddingLeft);
            const newIndentLevel = Math.round(newIndentPx / INDENT_WIDTH_PX);
            window.focusedEditor.format("indent", newIndentLevel, "user");
            break;
          }
          case "first-line": {
            window.focusedEditor.format(
              "text-indent",
              `${finalLeft}px`,
              "user"
            );
            break;
          }
          case "right-indent": {
            const contentWidth = scaledWidth / currentScale - paddingLeft;
            const newRightIndentPx = Math.max(
              0,
              contentWidth - finalLeft - paddingRight
            );
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

      // Add the new listeners
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  createDragHandler(leftIndentMarker, "left-indent");
  createDragHandler(firstLineMarker, "first-line");
  createDragHandler(rightIndentMarker, "right-indent");

  // --- 6. Event Listeners ---
  const editorUpdateHandler = () => {
    if (isRulerVisible) updateRulerMarkers();
  };

  function attachQuillListeners() {
    if (window.focusedEditor) {
      window.focusedEditor.on("selection-change", editorUpdateHandler);
      window.focusedEditor.on("text-change", editorUpdateHandler);
      fullRulerUpdate();
    } else {
      setTimeout(attachQuillListeners, 500);
    }
  }

  toggleRulerBtn.addEventListener("click", () => {
    isRulerVisible = !isRulerVisible;
    rulerSystem.style.display = isRulerVisible ? "block" : "none";
    if (isRulerVisible) {
      fullRulerUpdate();
    }
  });

  // --- Initial Setup ---
  attachQuillListeners();
  new ResizeObserver(fullRulerUpdate).observe(mainWhitePaperBoard);
});
