$(document).ready(function () {
  $("#alignTop").on("click", () => applyVerticalAlign("flex-start"));
  $("#alignMiddle").on("click", () => applyVerticalAlign("center"));
  $("#alignBottom").on("click", () => applyVerticalAlign("flex-end"));

  function applyVerticalAlign(alignValue) {
    const selectedRange = getSelectedRange();
    if (!selectedRange) return;

    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
        $(`div.cell[data-row=${r}][data-col=${c}]`).css(
          "align-items",
          alignValue
        );
      }
    }
  }
});
