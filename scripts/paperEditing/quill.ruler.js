// quill.ruler.js (Final Version with Google Docs Vertical Ruler Functionality)

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DOM Element References ---
  const mainWhitePaperBoard = document.getElementById("main_white_paper_board");
  const rulerSystem = document.getElementById("ruler-system-wrapper");
  const toggleRulerBtn = document.getElementById("toggle-ruler-btn");
  const hRuler = document.getElementById("horizontal-ruler");
  const vRuler = document.getElementById("vertical-ruler");
  const hRulerMarks = document.getElementById("h-ruler-marks");
  const vRulerMarks = document.getElementById("v-ruler-marks");
  // const topMarginMarker = document.getElementById("top-margin-marker"); // REMOVED: No longer needed
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
  const maxRulerHeightInPixels = 16 * PIXELS_PER_INCH;

  // -- THIS IS THE FIX: SEPARATE THE SCALES --
  const RULER_DRAWING_SCALE = 0.453;
  let realCurrentScale = RULER_DRAWING_SCALE;

  let isRulerVisible = false;

  // --- 3. Quill Integration ---
  const Parchment = Quill.import("parchment");

  // Register existing horizontal Attributors (they are working)
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
  Quill.register(
    new Parchment.Attributor.Style("top-margin", "margin-top", {
      scope: Parchment.Scope.BLOCK,
    })
  );
  // REMOVED: All TopMargin Attributor/Blot logic

  const getQlEditorMetrics = () => {
    const qlEditor = editorPaperWrapper.querySelector(".ql-editor");
    if (!qlEditor) return { left: 0, right: 0, width: 0, rect: null };
    const rect = qlEditor.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(qlEditor);

    const transform = window.getComputedStyle(
      qlEditor.closest(".editor_paper")
    ).transform;

    if (transform && transform !== "none") {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      realCurrentScale = matrix ? parseFloat(matrix[1].split(", ")[0]) : 1;
    } else {
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
    getQlEditorMetrics();
    const mainBoardWidth = mainWhitePaperBoard.clientWidth;
    hRuler.style.width = `${mainBoardWidth - 30}px`;

    vRuler.style.height = `${editorContainer.clientHeight}px`;
    generateRulerMarks();
    updateRulerMarkers();
    // REMOVED: updateTopMarginMarker();
  }

  function generateRulerMarks() {
    hRulerMarks
      .querySelectorAll(".ruler-mark, .ruler-number")
      .forEach((el) => el.remove());

    // Clean up all vertical marks/numbers (no marker to worry about preserving)
    vRulerMarks.innerHTML = "";

    const SUBDIVISIONS_PER_INCH = 4;
    const increment = PIXELS_PER_INCH / SUBDIVISIONS_PER_INCH;
    const maxRulerWidthInPixels = 16 * PIXELS_PER_INCH;

    // Horizontal Ruler Marks
    for (let i = 0; i <= maxRulerWidthInPixels; i += increment) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";
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
    for (let i = 0; i <= maxRulerHeightInPixels; i += increment) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";
      mark.style.top = `${i * RULER_DRAWING_SCALE + 5}px`;

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
    hRulerMarks.style.left = `${paperRect.left - rulerRect.left - 15}px`;
    const indentPx = (formats.indent || 0) * INDENT_WIDTH_PX;
    const textIndentPx = parseFloat(formats["text-indent"] || "0px");
    const rightIndentPx = parseFloat(formats["right-indent"] || "0px");

    // Marker positioning must use the REAL, live scale.
    leftIndentMarker.style.left = `${
      (paddingLeft + indentPx) * realCurrentScale + 15
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

  // quill.ruler.js (Final Version with Corrected Vertical Content Margin)

  function createVerticalTopMarginHandler(vRuler) {
    vRuler.setAttribute("draggable", "false");

    const mainWhitePaperBoard = document.getElementById(
      "main_white_paper_board"
    );

    let scrollOffset = 0;

    // ✅ Scroll Sync: keep the ruler fixed while paper scrolls
    mainWhitePaperBoard.addEventListener("scroll", () => {
      const scrollTop = mainWhitePaperBoard.scrollTop;
      vRuler.style.transform = `translateY(${-scrollTop}px)`;
      scrollOffset = scrollTop;
    });

    vRuler.addEventListener("mousedown", (e) => {
      const qlEditor = window.focusedEditor
        ? window.focusedEditor.container.querySelector(".ql-editor")
        : null;
      if (!qlEditor) return;

      e.preventDefault();
      e.stopPropagation();

      const dragStartY = e.pageY;
      const initialTop = parseFloat(qlEditor.style.marginTop || "0");

      document.body.classList.add("dragging-ns-resize");

      const onMouseMove = (moveEvent) => {
        requestAnimationFrame(() => {
          // Account for zoom/scale and scroll offset
          const deltaY = (moveEvent.pageY - dragStartY) / realCurrentScale;
          const newTop = Math.max(0, initialTop + deltaY);
          qlEditor.style.marginTop = `${newTop}px`;
        });
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.classList.remove("dragging-ns-resize");

        // Reset ruler background
        vRuler.style.background = "";
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  // ... (rest of the file remains the same) ...

  // --- 6. Scroll Synchronization Logic ---
  function syncRulerScroll() {
    // The element containing the scrollbar for the paper content.
    const editorScrollElement = editorContainer;
    if (editorScrollElement) {
      // Sync the ruler's scroll top with the editor's scroll top
      vRuler.scrollTop = editorScrollElement.scrollTop;
    }
  }

  // Attach the scroll listener to the element that scrolls the paper content
  editorContainer.addEventListener("scroll", syncRulerScroll);

  createDragHandler(leftIndentMarker, "left-indent");
  createDragHandler(rightIndentMarker, "right-indent");

  // NEW: Attach the drag handler to the vertical ruler element
  createVerticalTopMarginHandler(vRuler);

  // --- 7. Event Listeners ---
  const editorUpdateHandler = () => {
    if (isRulerVisible) {
      updateRulerMarkers();
    }
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
