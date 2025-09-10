const numberDropdown = document.querySelector(
  "#numberFunctionalitiesDropdown .dropdown-menu"
);

// A central place to define all formatting functions
const formatters = {
  General: (value) => value,
  Number: (value) => {
    const num = parseFloat(value);
    return !isNaN(num)
      ? num.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : value;
  },
  Currency: (value) => {
    const num = parseFloat(value);
    return !isNaN(num)
      ? num.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        })
      : value;
  },
  Accounting: (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    // Accounting format aligns the currency symbol, which is a CSS task.
    // For the value itself, we can format it like currency.
    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  },
  Percentage: (value) => {
    const num = parseFloat(value);
    return !isNaN(num) ? `${(num * 100).toFixed(2)}%` : value;
  },
  Scientific: (value) => {
    const num = parseFloat(value);
    return !isNaN(num) ? num.toExponential(2).toUpperCase() : value;
  },
  Text: (value) => value,
  DateShort: (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : value;
  },
  DateLong: (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : value;
  },
  Time24: (value) => {
    const date = new Date(`1970-01-01T${value}`); // Assume value is a time string
    return !isNaN(date.getTime())
      ? date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : value;
  },
  Time12: (value) => {
    const date = new Date(`1970-01-01T${value}`); // Assume value is a time string
    return !isNaN(date.getTime())
      ? date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : value;
  },
  DateTime: (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date.toLocaleString("en-US") : value;
  },
};

// Event listener for the dropdown menu
if (numberDropdown) {
  numberDropdown.addEventListener("click", (e) => {
    // Find the clicked dropdown item
    const item = e.target.closest(".dropdown-item");
    if (!item) return;

    const formatType = item.dataset.format;
    if (!formatType || !formatters[formatType]) {
      console.error("Unknown format type:", formatType);
      return;
    }

    // Get the currently selected cells from the main spreadsheet logic
    const selectedRange = getSelectedRange();
    if (!selectedRange) {
      // If no range is selected, try to format the last focused cell
      if (lastFocusedCell) {
        applyFormatToCell(lastFocusedCell, formatters[formatType]);
      } else {
        alert("Please select a cell or a range of cells to format.");
      }
      return;
    }

    // Apply the format to all cells in the selected range
    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
        const cell = $(`div.cell[data-col=${c}][data-row=${r}]`);
        if (cell.length > 0) {
          applyFormatToCell(cell, formatters[formatType]);
        }
      }
    }
  });
}

/**
 * Applies a given formatting function to a single cell.
 * @param {jQuery} $cell - The jQuery object for the cell.
 * @param {Function} formatter - The function to apply for formatting.
 */
function applyFormatToCell($cell, formatter) {
  const originalValue = $cell.text();
  // Do not format empty cells
  if (originalValue.trim() === "") return;

  const formattedValue = formatter(originalValue);
  $cell.text(formattedValue);
  // Store the original, unformatted value in a data attribute
  $cell.attr("data-raw-value", originalValue);
  $cell.attr("data-format", $cell.closest(".dropdown-item").data("format"));
}
