$(document).ready(function () {
  $("#textWrapBtn").on("click", function () {
    const selectedRange = getSelectedRange();
    if (!selectedRange) return;

    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
        const $cell = $(`div.cell[data-row=${r}][data-col=${c}]`);
        if ($cell.css("white-space") === "normal") {
          $cell.css({
            "white-space": "nowrap",
            overflow: "hidden",
          });
        } else {
          $cell.css({
            "white-space": "normal",
            overflow: "visible",
          });
        }
      }
    }
  });
});
