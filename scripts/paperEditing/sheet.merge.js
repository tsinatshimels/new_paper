$(document).ready(function () {
  $("#mergeCellBtn").on("click", function () {
    const selectedRange = getSelectedRange();
    if (
      !selectedRange ||
      (selectedRange.minCol === selectedRange.maxCol &&
        selectedRange.minRow === selectedRange.maxRow)
    ) {
      alert("Select multiple cells to merge.");
      return;
    }

    const firstCell = $(
      `div.cell-wrapper[data-row=${selectedRange.minRow}][data-col=${selectedRange.minCol}]`
    );
    const isMerged = firstCell.hasClass("merged");

    if (isMerged) {
      // Unmerge
      const colSpan = firstCell.data("colspan");
      const rowSpan = firstCell.data("rowspan");

      for (
        let r = selectedRange.minRow;
        r < selectedRange.minRow + rowSpan;
        r++
      ) {
        for (
          let c = selectedRange.minCol;
          c < selectedRange.minCol + colSpan;
          c++
        ) {
          const $cellWrapper = $(
            `div.cell-wrapper[data-row=${r}][data-col=${c}]`
          );
          $cellWrapper
            .css({
              "grid-column": "",
              "grid-row": "",
              visibility: "visible",
            })
            .removeClass("merged")
            .removeData("colspan")
            .removeData("rowspan");
        }
      }
    } else {
      // Merge
      const colSpan = selectedRange.maxCol - selectedRange.minCol + 1;
      const rowSpan = selectedRange.maxRow - selectedRange.minRow + 1;

      firstCell
        .css({
          "grid-column": `span ${colSpan}`,
          "grid-row": `span ${rowSpan}`,
        })
        .addClass("merged")
        .data({
          colspan: colSpan,
          rowspan: rowSpan,
        });

      for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
        for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
          if (r === selectedRange.minRow && c === selectedRange.minCol)
            continue;
          $(`div.cell-wrapper[data-row=${r}][data-col=${c}]`).css(
            "visibility",
            "hidden"
          );
        }
      }
    }
  });
});
