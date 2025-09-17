$(document).ready(function () {
  const fillColorBtn = document.getElementById("fillColorBtn");
  const fillColorPicker = document.getElementById("fillColorPicker");

  fillColorBtn.addEventListener("click", () => {
    fillColorPicker.click();
  });

  fillColorPicker.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    const selectedRange = getSelectedRange();

    if (selectedRange) {
      for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
        for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
          $(`div.cell[data-row=${r}][data-col=${c}]`).css(
            "background-color",
            selectedColor
          );
        }
      }
    } else if (lastFocusedCell) {
      lastFocusedCell.css("background-color", selectedColor);
    }
  });
});
