function parseTimeValue(value) {
  const strValue = String(value).trim();
  let date = new Date(); // Use today as a base, we only care about the time.
  let hours = 0;
  let minutes = 0;

  // Case 1: Input contains a colon, e.g., "15:30"
  if (strValue.includes(":")) {
    const parts = strValue.split(":");
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10) || 0;
  }
  // Case 2: Input is a valid number, e.g., "15" or "9.5"
  else if (!isNaN(parseFloat(strValue)) && isFinite(strValue)) {
    const num = parseFloat(strValue);
    hours = Math.floor(num); // The integer part is the hour
    minutes = Math.round((num - hours) * 60); // The decimal part represents the fraction of an hour
  }
  // Case 3: The input is not a recognized time format
  else {
    return null;
  }

  // Final validation to ensure we have a real time
  if (
    isNaN(hours) ||
    hours < 0 ||
    hours > 23 ||
    isNaN(minutes) ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  date.setHours(hours, minutes, 0, 0);
  return date;
}

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
  Euro: (value) => {
    const num = parseFloat(value);
    return !isNaN(num)
      ? num.toLocaleString("en-IE", {
          style: "currency",
          currency: "EUR",
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
    const date = parseTimeValue(value); // Use the new helper function
    return date
      ? date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : value;
  },
  Time12: (value) => {
    const date = parseTimeValue(value); // Use the new helper function
    return date
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

const percentageBtn = document.getElementById("sizemug_percentage--btn");
if (percentageBtn) {
  percentageBtn.addEventListener("click", () => {
    const selectedRange = getSelectedRange();
    if (!selectedRange) {
      if (lastFocusedCell) {
        applyFormatToCell(lastFocusedCell, formatters["Percentage"]);
      } else {
        alert("Please select a cell or a range of cells to format.");
      }
      return;
    }

    // Apply the Percentage format to all cells in the selected range
    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
        const cell = $(`div.cell[data-col=${c}][data-row=${r}]`);
        if (cell.length > 0) {
          applyFormatToCell(cell, formatters["Percentage"]);
        }
      }
    }
  });
}

function decreaseDecimalPlaces(value) {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return value; // Return original value if it's not a number
  }

  // Determine the current number of decimal places
  const decimalPart = value.toString().split(".")[1] || "";
  const currentDecimalPlaces = decimalPart.length;

  // Decrease decimal places, ensuring it doesn't go below zero
  const newDecimalPlaces = Math.max(0, currentDecimalPlaces - 1);

  return num.toFixed(newDecimalPlaces);
}

// Event listener for the decrease decimal places button
const decreaseDecimalBtn = document.getElementById(
  "decreaseDecimalPlaces--btn"
);
if (decreaseDecimalBtn) {
  decreaseDecimalBtn.addEventListener("click", () => {
    const selectedRange = getSelectedRange();
    if (!selectedRange) {
      if (lastFocusedCell) {
        applyFormatToCell(lastFocusedCell, decreaseDecimalPlaces);
      } else {
        alert("Please select a cell or a range of cells to format.");
      }
      return;
    }

    // Apply the decrease decimal format to all cells in the selected range
    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
        const cell = $(`div.cell[data-col=${c}][data-row=${r}]`);
        if (cell.length > 0) {
          applyFormatToCell(cell, decreaseDecimalPlaces);
        }
      }
    }
  });
}
function increaseDecimalPlaces(value) {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return value; // Return original value if it's not a number
  }

  // Determine the current number of decimal places
  const decimalPart = value.toString().split(".")[1] || "";
  const currentDecimalPlaces = decimalPart.length;

  // Increase decimal places by one
  const newDecimalPlaces = currentDecimalPlaces + 1;

  return num.toFixed(newDecimalPlaces);
}

// Event listener for the increase decimal places button
const increaseDecimalBtn = document.getElementById(
  "increaseDecimalPlaces--btn"
);
if (increaseDecimalBtn) {
  increaseDecimalBtn.addEventListener("click", () => {
    const selectedRange = getSelectedRange();
    if (!selectedRange) {
      if (lastFocusedCell) {
        applyFormatToCell(lastFocusedCell, increaseDecimalPlaces);
      } else {
        alert("Please select a cell or a range of cells to format.");
      }
      return;
    }

    // Apply the increase decimal format to all cells in the selected range
    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
        const cell = $(`div.cell[data-col=${c}][data-row=${r}]`);
        if (cell.length > 0) {
          applyFormatToCell(cell, increaseDecimalPlaces);
        }
      }
    }
  });
}
const addCurrencyBtn = document.getElementById("addCurrency--btn");
if (addCurrencyBtn) {
  addCurrencyBtn.addEventListener("click", () => {
    const selectedRange = getSelectedRange();
    if (!selectedRange) {
      if (lastFocusedCell) {
        applyFormatToCell(lastFocusedCell, formatters["Euro"]);
      } else {
        alert("Please select a cell or a range of cells to format.");
      }
      return;
    }

    // Apply the Currency format to all cells in the selected range
    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
        const cell = $(`div.cell[data-col=${c}][data-row=${r}]`);
        if (cell.length > 0) {
          applyFormatToCell(cell, formatters["Euro"]);
        }
      }
    }
  });
}
