$(document).ready(function () {
  let currentBorderColor = "#000000";
  let currentBorderStyle = "1px solid";

  const $borderColorBtn = $("#borderColorBtn");
  const $borderColorPicker = $("#borderColorPicker");
  const $borderColorPreview = $("#borderColorPreview");
  const $borderStyleSelect = $("#borderStyleSelect");

  // --- State Management ---

  // Update preview and variable when color picker changes
  $borderColorPicker.on("input", function () {
    currentBorderColor = $(this).val();
    $borderColorPreview.css("background-color", currentBorderColor);
  });

  // Trigger the hidden color picker when the button is clicked
  $borderColorBtn.on("click", function () {
    $borderColorPicker.click();
  });

  // Update variable when border style changes
  $borderStyleSelect.on("change", function () {
    currentBorderStyle = $(this).val();
  });

  // --- Border Application Logic ---

  // Attach a single click handler to the menu for all border type buttons
  $("#borders-menu").on("click", ".dropdown-item", function () {
    const borderType = $(this).attr("id");
    if (borderType) {
      applyBorders(borderType);
    }
  });

  function applyBorders(type) {
    const selectedRange = getSelectedRange();
    if (!selectedRange) {
      alert("Please select a range of cells first.");
      return;
    }

    const borderCss = `${currentBorderStyle} ${currentBorderColor}`;

    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
        const $cell = $(`div.cell[data-row=${r}][data-col=${c}]`);
        const isTop = r === selectedRange.minRow;
        const isBottom = r === selectedRange.maxRow;
        const isLeft = c === selectedRange.minCol;
        const isRight = c === selectedRange.maxCol;

        // The logic for each border type
        switch (type) {
          case "borderClear":
            $cell.css({
              "border-top": "",
              "border-bottom": "",
              "border-left": "",
              "border-right": "",
            });
            break;
          case "borderAll":
            $cell.css("border", borderCss);
            break;
          case "borderOuter":
            if (isTop) $cell.css("border-top", borderCss);
            if (isBottom) $cell.css("border-bottom", borderCss);
            if (isLeft) $cell.css("border-left", borderCss);
            if (isRight) $cell.css("border-right", borderCss);
            break;
          case "borderInner":
            if (!isTop) $cell.css("border-top", borderCss);
            if (!isLeft) $cell.css("border-left", borderCss);
            break;
          case "borderInnerHorizontal":
            if (!isBottom) {
              $cell.css("border-bottom", borderCss);
            }
            break;
          case "borderInnerVertical":
            if (!isRight) {
              $cell.css("border-right", borderCss);
            }
            break;
          case "borderTop":
            if (isTop) $cell.css("border-top", borderCss);
            break;
          case "borderBottom":
            if (isBottom) $cell.css("border-bottom", borderCss);
            break;
          case "borderLeft":
            if (isLeft) $cell.css("border-left", borderCss);
            break;
          case "borderRight":
            if (isRight) $cell.css("border-right", borderCss);
            break;
        }
      }
    }
  }
});
