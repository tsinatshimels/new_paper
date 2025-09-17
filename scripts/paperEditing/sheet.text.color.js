const textColorBtn = document.getElementById("textColorBtn");
const textColorPicker = document.getElementById("textColorPicker");

textColorBtn.addEventListener("click", () => {
  textColorPicker.click();
});

textColorPicker.addEventListener("input", (event) => {
  const selectedColor = event.target.value;
  const selectedRange = getSelectedRange();

  if (selectedRange) {
    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
        $(`div.cell[data-row=${r}][data-col=${c}]`).css("color", selectedColor);
      }
    }
  } else if (lastFocusedCell) {
    lastFocusedCell.css("color", selectedColor);
  }
});
