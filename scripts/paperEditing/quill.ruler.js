// quill.ruler.js (Corrected Version for new HTML structure, drag, caret, and ruler numbering)

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DOM Element References ---
  const mainWhitePaperBoard = document.getElementById("main_white_paper_board");
  const rulerSystem = document.getElementById("ruler-system-wrapper");
  const toggleRulerBtn = document.getElementById("toggle-ruler-btn"); // Ensure this button exists!
  const hRuler = document.getElementById("horizontal-ruler");
  const vRuler = document.getElementById("vertical-ruler");
  const hRulerMarks = document.getElementById("h-ruler-marks");
  const vRulerMarks = document.getElementById("v-ruler-marks");
  const leftIndentMarker = document.getElementById("left-indent-marker");
  const firstLineMarker = document.getElementById("first-line-marker");
  const rightIndentMarker = document.getElementById("right-indent-marker");
  const editorContainer = document.getElementById("editor-container"); // This now wraps editor_paper
  const editorPaper = document.getElementById("editor_paper"); // The element that gets scaled
  const editorPaperWrapper = document.getElementById("editor_paper--wrapper"); // The direct parent of .ql-editor
  const caretRulerLine = document.getElementById("caret-ruler-line");
  const caretRulerTooltip = document.getElementById("caret-ruler-tooltip");

  // Critical check to prevent script errors
  if (
    !mainWhitePaperBoard ||
    !rulerSystem ||
    !toggleRulerBtn ||
    !hRuler ||
    !vRuler ||
    !leftIndentMarker ||
    !firstLineMarker ||
    !rightIndentMarker ||
    !editorContainer ||
    !editorPaper ||
    !editorPaperWrapper ||
    !caretRulerLine
  ) {
    console.error(
      "One or more required elements for the ruler system not found. Ruler script will not run.",
      {
        mainWhitePaperBoard,
        rulerSystem,
        toggleRulerBtn,
        hRuler,
        vRuler,
        leftIndentMarker,
        firstLineMarker,
        rightIndentMarker,
        editorContainer,
        editorPaper,
        editorPaperWrapper,
        caretRulerLine,
      }
    );
    return;
  }

  // --- 2. State Variables ---
  const RULER_WIDTH = 30; // Width of vertical ruler/corner
  const RULER_HEIGHT = 30; // Height of horizontal ruler/corner
  const PIXELS_PER_INCH = 96;
  const MARKER_WIDTH = 16;
  const HALF_MARKER_WIDTH = MARKER_WIDTH / 2;

  let currentScale = 1;
  let isRulerVisible = false;

  // `focusedEditor` is assumed to be a globally accessible Quill instance,
  // managed elsewhere (e.g., from your bold.js example).

  // --- 3. Quill and Indent Setup ---
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
    let cachedWidth = null;
    function measure() {
      // Create a temporary Quill-like structure to measure default indent
      const tempWrapper = document.createElement("div");
      tempWrapper.innerHTML =
        '<div class="ql-editor"><p class="ql-indent-1"></p></div>';
      tempWrapper.style.cssText =
        "position:absolute;top:-9999px;left:-9999px;visibility:hidden;";
      document.body.appendChild(tempWrapper);
      const indentWidth = parseFloat(
        window.getComputedStyle(tempWrapper.querySelector(".ql-indent-1"))
          .paddingLeft
      );
      document.body.removeChild(tempWrapper);
      return indentWidth > 0 ? indentWidth : 48; // Default to 48px if unable to measure
    }
    return {
      getWidth: function () {
        if (cachedWidth === null) cachedWidth = measure();
        return cachedWidth;
      },
    };
  })();

  const INDENT_WIDTH_PX = IndentMeasurer.getWidth(); // Correctly scoped now

  // --- Helper to get Quill editor's actual content area metrics ---
  function getQlEditorContentMetrics() {
    // The .ql-editor is dynamically created inside #editor_paper--wrapper
    const qlEditor = editorPaperWrapper.querySelector(".ql-editor");
    if (!qlEditor) {
      return { left: 0, right: 0, width: 0, clientRect: null };
    }
    const computedStyle = window.getComputedStyle(qlEditor);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);
    const clientRect = qlEditor.getBoundingClientRect(); // Get actual scaled dimensions and position

    return {
      left: paddingLeft, // Unscaled padding
      right: paddingRight, // Unscaled padding
      width: clientRect.width, // Scaled total width (content + padding)
      clientRect: clientRect, // Bounding client rect of the scaled .ql-editor
    };
  }

  // --- 4. CORE LOGIC FUNCTIONS ---

  function fullRulerUpdate() {
    if (!isRulerVisible) return;

    // Get current scale from editorPaper (the element being scaled)
    const transformStyle = window.getComputedStyle(editorPaper).transform;
    currentScale = 1;
    if (transformStyle && transformStyle !== "none") {
      const matrix = transformStyle.match(/matrix\(([^)]+)\)/);
      if (matrix && matrix[1])
        currentScale = parseFloat(matrix[1].split(", ")[0]);
    }

    // Horizontal ruler takes the whole width of main_white_paper_board, minus the vertical ruler's fixed width
    const mainBoardWidth = mainWhitePaperBoard.clientWidth;
    hRuler.style.width = `${mainBoardWidth - RULER_WIDTH}px`;

    // Vertical ruler height matches the editorContainer's height, as that's its scrollable viewport
    vRuler.style.height = `${editorContainer.clientHeight}px`;

    generateRulerMarks(); // Regenerate marks with new dimensions
    updateRulerMarkers(); // Update marker positions
  }

  function generateRulerMarks() {
    hRulerMarks.innerHTML = "";
    vRulerMarks.innerHTML = "";

    const hRulerWidth = parseFloat(hRuler.style.width);
    const vRulerHeight = parseFloat(vRuler.style.height);

    // --- Horizontal Ruler Marks ---
    // The hRulerMarks div starts at the pixel where editor-container starts (30px from main_white_paper_board's left).
    // So 'i' in this loop represents the pixel position relative to the left edge of editor-container.
    for (let i = 0; i <= 610; i += (PIXELS_PER_INCH / 16) * currentScale) {
      const mark = document.createElement("div");
      mark.className = "ruler-mark";
      mark.style.left = `${i}px`;
      hRulerMarks.appendChild(mark);

      // Calculate inch value relative to the START OF THE EDITOR-CONTAINER (which aligns with hRulerMarks' 0)
      const inchValue = i / (PIXELS_PER_INCH * currentScale);

      // Only add numbers for major marks and only if the inch value is non-negative
      // This fulfills "numbers starting at the edge of the left paper-editor" (editor-container)
      if (Math.abs(inchValue % 1) < 0.01 && inchValue >= -0.01) {
        mark.classList.add("major");
        const num = document.createElement("span");
        num.className = "ruler-number";
        num.textContent = Math.round(inchValue);
        num.style.left = `${i}px`;
        hRulerMarks.appendChild(num);
      } else if (Math.abs(inchValue % 0.5) < 0.01 && inchValue >= -0.01) {
        // Half-inch marks for ticks
        mark.classList.add("minor");
      }
      // Marks before editor-container start (if any) or very minor ticks will just be plain ruler-mark
      // which fulfills "other parts of the ruler are just a background without a number".
    }

    // --- Vertical Ruler Marks (numbers start at 0 at the top of the paper) ---
    for (
      let i = 0;
      i <= vRulerHeight;
      i += (PIXELS_PER_INCH / 16) * currentScale
    ) {
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
    if (!focusedEditor || !isRulerVisible) {
      caretRulerLine.style.display = "none";
      return;
    }
    const selection = focusedEditor.getSelection();
    if (!selection) {
      // No selection at all, or selection is null
      caretRulerLine.style.display = "none";
      return;
    }

    const formats = focusedEditor.getFormat(selection.index) || {};
    const {
      left: qlEditorPaddingLeft,
      width: qlEditorScaledWidth,
      right: qlEditorPaddingRight,
    } = getQlEditorContentMetrics();

    const indentPx = (formats.indent || 0) * INDENT_WIDTH_PX;
    const textIndentPx = parseFloat(formats["text-indent"] || "0px");
    const rightIndentPx = parseFloat(formats["right-indent"] || "0px");

    // All positions (desiredLeftIndentEdge, etc.) are relative to the start of the hRulerMarks div
    // (which aligns with the left edge of editor-container).

    // --- Left Indent Marker Positioning ---
    // qlEditorPaddingLeft is the offset *from the editor_paper's left edge* to the *ql-editor's content start*.
    // The markers themselves are positioned relative to the hRuler (which aligns with editor-container).
    const desiredLeftIndentEdge =
      (qlEditorPaddingLeft + indentPx) * currentScale;
    leftIndentMarker.style.left = `${
      desiredLeftIndentEdge + HALF_MARKER_WIDTH + 300
    }px`;

    // --- First Line Marker Positioning ---
    // This is relative to the `left-indent-marker`'s visual left edge (its parent in HTML).
    const desiredFirstLineIndentAbsoluteEdge =
      (qlEditorPaddingLeft + indentPx + textIndentPx) * currentScale;
    const parentLeftEdgeAbsolute =
      parseFloat(leftIndentMarker.style.left) - HALF_MARKER_WIDTH; // Absolute visual left of parent
    firstLineMarker.style.left = `${
      desiredFirstLineIndentAbsoluteEdge - parentLeftEdgeAbsolute + 300
    }px`;
    firstLineMarker.style.left = `${Math.max(
      0,
      parseFloat(firstLineMarker.style.left)
    )}px`;

    // --- Right Indent Marker Positioning ---
    // The right edge of the *content area* within Quill's editor.
    const contentAreaRightAbsolute =
      qlEditorScaledWidth - qlEditorPaddingRight * currentScale; // Scaled width minus scaled padding
    const desiredRightIndentAbsoluteEdge =
      contentAreaRightAbsolute - rightIndentPx * currentScale;
    rightIndentMarker.style.left = `${
      desiredRightIndentAbsoluteEdge - HALF_MARKER_WIDTH
    }px`;

    updateCaretRulerLine(selection);
  }

  function updateCaretRulerLine(selection) {
    if (
      !focusedEditor ||
      !isRulerVisible ||
      !selection ||
      selection.length > 0
    ) {
      // selection.length > 0 means text is highlighted
      caretRulerLine.style.display = "none";
      return;
    }

    const bounds = focusedEditor.getBounds(selection.index);
    if (!bounds) {
      caretRulerLine.style.display = "none";
      return;
    }

    const { left: qlEditorPaddingLeft } = getQlEditorContentMetrics();
    // Caret's absolute left position relative to hRulerMarks' 0 (which aligns with editor-container's left).
    // bounds.left is relative to the .ql-editor's content area (after its own padding).
    const caretPositionFromEditorContainerLeft =
      (qlEditorPaddingLeft + bounds.left) * currentScale;

    caretRulerLine.style.left = `${caretPositionFromEditorContainerLeft}px`;
    caretRulerLine.style.height = vRuler.style.height; // Should span the height of the editor content
    caretRulerLine.style.display = "block";
    caretRulerLine.classList.add("active");

    // Tooltip value reflects inches from the START OF THE EDITOR-CONTAINER (which is hRulerMarks' 0)
    const inchValueFromEditorContainerLeft =
      caretPositionFromEditorContainerLeft / (PIXELS_PER_INCH * currentScale);
    caretRulerTooltip.textContent = `${inchValueFromEditorContainerLeft.toFixed(
      2
    )} in`;
  }

  // --- 5. DRAGGING LOGIC ---
  let isDragging = false;
  let dragStartX = 0;
  let initialMarkerLeft = 0;
  let activeMarker = null;

  // Cache editor metrics at the start of a drag for performance
  let cachedQlEditorMetrics = { left: 0, right: 0, width: 0, clientRect: null };
  let cachedContentAreaPixelLeft = 0;
  let cachedContentAreaPixelRight = 0;

  function createDragHandler(markerElement, type) {
    markerElement.addEventListener("mousedown", (e) => {
      // Ensure ruler is visible and an editor is active before allowing drag
      if (!isRulerVisible || !focusedEditor) {
        return;
      }
      e.preventDefault(); // Prevent text selection
      e.stopPropagation(); // Stop event bubbling to parent elements

      isDragging = true;
      dragStartX = e.pageX;
      activeMarker = markerElement;

      // Store initial `left` position of the marker (relative to hRuler)
      initialMarkerLeft = parseFloat(
        window.getComputedStyle(markerElement).left
      );

      // --- Cache metrics here once per drag start for smoothness ---
      cachedQlEditorMetrics = getQlEditorContentMetrics();
      cachedContentAreaPixelLeft = cachedQlEditorMetrics.left * currentScale;
      cachedContentAreaPixelRight =
        cachedQlEditorMetrics.width -
        cachedQlEditorMetrics.right * currentScale;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      // --- IMPROVEMENT FOR SMOOTHNESS ---
      // Disable global text selection and editor interaction during drag
      document.body.style.userSelect = "none"; // Disables text selection across the whole page
      editorContainer.style.pointerEvents = "none"; // Disables interaction with Quill editor content
      document.body.classList.add("dragging-ew-resize"); // Changes cursor globally
      // console.log(`Started dragging: ${type}`);
    });

    const onMouseMove = (e) => {
      if (!isDragging || activeMarker !== markerElement || !focusedEditor)
        return;
      e.preventDefault();

      const deltaX = e.pageX - dragStartX;
      let newMarkerLeft = initialMarkerLeft + deltaX;

      // Use cached values for performance
      const { left: qlEditorPaddingLeft } = cachedQlEditorMetrics;
      const contentAreaPixelLeft = cachedContentAreaPixelLeft;
      const contentAreaPixelRight = cachedContentAreaPixelRight;

      if (type === "left-indent") {
        let visualMarkerLeftEdge = newMarkerLeft - HALF_MARKER_WIDTH;

        // Constraint 1: Cannot go left of the Quill editor's content start
        visualMarkerLeftEdge = Math.max(
          contentAreaPixelLeft,
          visualMarkerLeftEdge
        );

        // Constraint 2: Cannot go right past the right indent marker
        const rightMarkerVisualLeftEdge =
          parseFloat(window.getComputedStyle(rightIndentMarker).left) -
          HALF_MARKER_WIDTH;
        visualMarkerLeftEdge = Math.min(
          visualMarkerLeftEdge,
          rightMarkerVisualLeftEdge - MARKER_WIDTH
        );

        newMarkerLeft = visualMarkerLeftEdge + HALF_MARKER_WIDTH; // Convert back to marker's `left` property
      } else if (type === "first-line") {
        // This marker's `left` is relative to its parent (`left-indent-marker` element).
        let visualRelativeLeftEdge = newMarkerLeft; // This marker doesn't have translateX(-50%) itself

        // Constraint 1: Cannot go left of the #left-indent-marker's visual left edge (relative to parent's content box)
        visualRelativeLeftEdge = Math.max(0, visualRelativeLeftEdge);

        // Constraint 2: Cannot go right past the effective right content boundary
        // We need the total width available for the content from the parent's starting point
        const parentAbsoluteLeftEdge =
          parseFloat(leftIndentMarker.style.left) - HALF_MARKER_WIDTH;
        const maxRelativeRight =
          contentAreaPixelRight - parentAbsoluteLeftEdge - MARKER_WIDTH;
        visualRelativeLeftEdge = Math.min(
          visualRelativeLeftEdge,
          maxRelativeRight
        );

        newMarkerLeft = visualRelativeLeftEdge; // Keep as relative position for firstLineMarker
      } else if (type === "right-indent") {
        let visualMarkerRightEdge = newMarkerLeft + HALF_MARKER_WIDTH;

        // Constraint 1: Cannot go right of the Quill editor's content end
        visualMarkerRightEdge = Math.min(
          contentAreaPixelRight,
          visualMarkerRightEdge
        );

        // Constraint 2: Cannot go left past the left indent marker
        const leftMarkerVisualRightEdge =
          parseFloat(window.getComputedStyle(leftIndentMarker).left) +
          HALF_MARKER_WIDTH;
        visualMarkerRightEdge = Math.max(
          visualMarkerRightEdge,
          leftMarkerVisualRightEdge + MARKER_WIDTH
        );

        newMarkerLeft = visualMarkerRightEdge - HALF_MARKER_WIDTH; // Convert back to marker's `left` property
      }

      markerElement.style.left = `${newMarkerLeft}px`;
      // Update caret ruler line for immediate feedback during drag.
      updateCaretRulerLine(focusedEditor.getSelection());
    };

    const onMouseUp = (e) => {
      if (!isDragging || activeMarker !== markerElement || !focusedEditor)
        return;

      isDragging = false;
      activeMarker = null;

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // --- IMPROVEMENT FOR SMOOTHNESS ---
      document.body.style.userSelect = ""; // Re-enable text selection globally
      editorContainer.style.pointerEvents = "auto"; // Re-enable editor interaction
      document.body.classList.remove("dragging-ew-resize");
      // console.log(`Ended dragging: ${type}`);

      // Re-fetch metrics for final calculation after drag, in case anything changed
      const {
        left: qlEditorPaddingLeft,
        width: qlEditorScaledWidth,
        right: qlEditorPaddingRight,
      } = getQlEditorContentMetrics();

      if (type === "left-indent") {
        const markerAbsoluteLeftEdge =
          parseFloat(markerElement.style.left) - HALF_MARKER_WIDTH;
        // Calculate indent from Quill editor's content start, relative to hRulerMarks' 0.
        const newIndentPx =
          (markerAbsoluteLeftEdge - qlEditorPaddingLeft * currentScale) /
          currentScale;
        const newIndentLevel = Math.round(newIndentPx / INDENT_WIDTH_PX);
        focusedEditor.format("indent", newIndentLevel, "user");
      } else if (type === "first-line") {
        const parentLeftEdgeAbsolute =
          parseFloat(leftIndentMarker.style.left) - HALF_MARKER_WIDTH;
        const firstLineAbsoluteEdge =
          parentLeftEdgeAbsolute + parseFloat(markerElement.style.left);

        const currentIndentLevel = focusedEditor.getFormat().indent || 0;
        const leftIndentAbsoluteEdge =
          (qlEditorPaddingLeft + currentIndentLevel * INDENT_WIDTH_PX) *
          currentScale;

        const newTextIndentPx =
          (firstLineAbsoluteEdge - leftIndentAbsoluteEdge) / currentScale;
        focusedEditor.format("text-indent", `${newTextIndentPx}px`, "user");
      } else if (type === "right-indent") {
        const markerAbsoluteRightEdge =
          parseFloat(markerElement.style.left) + HALF_MARKER_WIDTH;
        const contentAreaRightPixel =
          qlEditorScaledWidth - qlEditorPaddingRight * currentScale;
        const newRightIndentPx =
          (contentAreaRightPixel - markerAbsoluteRightEdge) / currentScale;
        focusedEditor.format("right-indent", `${newRightIndentPx}px`, "user");
      }
      updateRulerMarkers(); // Re-update markers after Quill format
    };
  }

  // --- 6. RENDER LOOP & EVENT LISTENERS ---

  function rulerRenderLoop() {
    if (!isRulerVisible) return;

    fullRulerUpdate();
    requestAnimationFrame(rulerRenderLoop);
  }

  toggleRulerBtn.addEventListener("click", () => {
    const shouldBeVisible = !isRulerVisible;

    if (shouldBeVisible) {
      console.log("Showing ruler and starting render loop.");
      rulerSystem.style.display = "block";
      isRulerVisible = true;
      fullRulerUpdate(); // Initial update before loop starts
      rulerRenderLoop();
    } else {
      console.log("Hiding ruler and stopping render loop.");
      rulerSystem.style.display = "none";
      isRulerVisible = false;
      caretRulerLine.style.display = "none"; // Hide caret line when ruler is hidden
    }
  });

  // Attach drag handlers to markers
  createDragHandler(leftIndentMarker, "left-indent");
  createDragHandler(firstLineMarker, "first-line");
  createDragHandler(rightIndentMarker, "right-indent");

  const attachQuillListeners = () => {
    // Check if focusedEditor is defined and is a Quill instance
    if (
      typeof focusedEditor !== "undefined" &&
      focusedEditor !== null &&
      typeof focusedEditor.on === "function"
    ) {
      // Important: Remove previous listeners if this could be called multiple times
      focusedEditor.off("selection-change", editorUpdateHandler);
      focusedEditor.off("text-change", editorUpdateHandler);
      focusedEditor.off("editor-change", editorUpdateHandler); // Add editor-change for broader updates

      focusedEditor.on("selection-change", editorUpdateHandler);
      focusedEditor.on("text-change", editorUpdateHandler);
      focusedEditor.on("editor-change", editorUpdateHandler); // Catch changes from toolbar etc.
      console.log("Ruler listeners attached to focusedEditor.");

      if (isRulerVisible) {
        updateRulerMarkers();
      }
    } else {
      console.warn(
        "Global 'focusedEditor' is not a valid Quill instance. Indent markers and caret line may not function correctly. Please ensure 'focusedEditor' is initialized and accessible."
      );
      caretRulerLine.style.display = "none"; // Ensure caret line is hidden if no editor
    }
  };

  // This handler will be called by Quill's events
  const editorUpdateHandler = (eventName, ...args) => {
    if (isRulerVisible) {
      updateRulerMarkers();
    }
  };

  // Set up listeners initially. If focusedEditor changes later, you'll need
  // to call `attachQuillListeners()` again.
  attachQuillListeners();

  // --- Initial Setup ---
  rulerSystem.style.display = "none";
  isRulerVisible = false;
  caretRulerLine.style.display = "none";
});
