window.currentEditorMode = "true";
let buttonsToDisable = [
  "sizemug_emoji--btn",
  "sizemug_boomark--btn",
  "add_bar_chart",
  "import_video_tool",
  "add_line_chart",
  "sizemug_add_horizontal_line--btn",
  "add_pie_chart",
  "sizemug_quotation--btn",
  "sizemug_citation--btn",
  "sizemug_special_characters--btn",
  "sizemug_add_date--btn",
  "sizemug_rectangle_shape--btn",
  "sizemug_pen--btn",
  "sizemug_add_cell--btn",
  "sizemug_circle_shape--btn",
  "sizemug_pencil--btn",
  "sizemug_add_column--btn",
  "sizemug_triangle_shape--btn",
  "sizemug_arrow--btn",
  "sizemug_play_slide_show--btn",
  "sizemug_add_table--btn",
  "sizemug_row_grid_center--btn",
  "sizemug_column_grid_left--btn",
  "sizemug_no_grid--btn",
  "sizemug_row_grid_bottom--btn",
  "sizemug_column_grid_right--btn",
  "sizemug_column_grid_center--btn",
  "sizemug_row_grid_top--btn",
  "sizemug_outline_grid--btn",
  "sizemug_frame--btn",
  "toggle-ruler-btn",
];

let toastTimeout;
function showToast(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const sheetTools = document.getElementById("sheet_tools");
  const mainWhitePaperBoard = document.getElementById("main_white_paper_board");
  const dropdownSelectButton = document.querySelector(
    "#SheetToDocsDropdown .dropdown-select button"
  );

  const rulerSystem = document.getElementById("ruler-system-wrapper");
  const wordDropdown = document.getElementById("exportWord--dropdown");
  const sheetDropdown = document.getElementById("exportSheet--dropdown");
  // Sheet exports
  document
    .getElementById("export-csv")
    .addEventListener("click", () => exportSheetData("csv"));
  document
    .getElementById("export-xls")
    .addEventListener("click", () => exportSheetData("xls"));
  document
    .getElementById("export-xlsx")
    .addEventListener("click", () => exportSheetData("xlsx"));

  // Word exports
  document.getElementById("export-txt").addEventListener("click", exportAsTXT);
  document.getElementById("export-doc").addEventListener("click", exportAsDOC);
  document
    .getElementById("export-docx")
    .addEventListener("click", exportAsDOCX);

  // Common exports that work in both modes
  document
    .getElementById("export-pdf-sheet")
    .addEventListener("click", exportAsPDF);
  document
    .getElementById("export-pdf-word")
    .addEventListener("click", exportAsPDF);
  document
    .getElementById("export-xml-sheet")
    .addEventListener("click", exportAsXML);
  document
    .getElementById("export-xml-word")
    .addEventListener("click", exportAsXML);

  function updateModeSwitcherAppearance(mode) {
    if (mode === "true") {
      dropdownSelectButton.innerHTML = `
        <div style="display: flex; align-items: center; gap: 4px;">
            <img src="./icons/word-icon.svg" style="width: 18px; height: 18px; vertical-align: middle;" />
            <span>Docs</span>
        </div>`;
    } else if (mode === "false") {
      dropdownSelectButton.innerHTML = `
        <div style="display: flex; align-items: center; gap: 4px;">
            <img src="./icons/sheet_icon.svg" style="width: 18px; height: 18px; vertical-align: middle;" />
            <span>Sheet</span>
        </div>`;
    }
  }

  function setMode(mode) {
    window.currentEditorMode = mode;
    updateModeSwitcherAppearance(mode);
    if (mode !== "true") {
      rulerSystem.style.display = "none";
      sheetTools.classList.add("active");
      buttonsToDisable.forEach((btnId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.classList.add("disabled");
          btn.disabled = true;
          btn.style.cursor = "not-allowed";
        }
      });
      mainWhitePaperBoard.classList.add("sheet-active");
      wordDropdown.classList.add("paper--hidden");
      sheetDropdown.classList.remove("paper--hidden");
    } else {
      sheetDropdown.classList.add("paper--hidden");
      wordDropdown.classList.remove("paper--hidden");
      mainWhitePaperBoard.classList.remove("sheet-active");
      sheetTools.classList.remove("active");
      buttonsToDisable.forEach((btnId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.classList.remove("disabled");
          btn.disabled = false;
          btn.style.cursor = "";
        }
      });
    }
  }

  setMode(window.currentEditorMode);

  document
    .querySelector("#docsButton")
    .addEventListener("click", () => setMode("true"));
  document
    .querySelector("#sheetButton")
    .addEventListener("click", () => setMode("false"));
});

const cols = 21;
const rows = 50;
const $sheet = $("#spreadsheet");
const $cellsWrapper = $("#cells_wrapper");
const cellAddressInput = document.querySelector('nav input[placeholder="A2"]');
const cellContentInput = document.querySelector("nav label input");

let activeMathSheetField = null;
let lastFocusedCell = null;

function deactivateActiveMathSheetField() {
  if (activeMathSheetField) {
    activeMathSheetField.readOnly = true;
    $(activeMathSheetField).removeClass("is-editing");
    activeMathSheetField = null;
    if (lastFocusedCell) {
      updateFormulaBarForCell(lastFocusedCell);
    }
  }
}

function activateMathSheetField(mathField) {
  if (mathField === activeMathSheetField) return;
  deactivateActiveMathSheetField();
  activeMathSheetField = mathField;
  activeMathSheetField.readOnly = false;
  $(activeMathSheetField).addClass("is-editing");
  activeMathSheetField.focus();
  cellContentInput.value = activeMathSheetField.getValue();
}

$sheet.on("click", "math-field", function (e) {
  if (window.currentEditorMode === "false") {
    e.stopPropagation();
    activateMathSheetField(this);
  }
});

document.addEventListener("click", (event) => {
  if (window.currentEditorMode === "false") {
    if (!event.target.closest("math-field.is-editing")) {
      deactivateActiveMathSheetField();
    }
  }
});

window.insertIntoSheetEditor = function (data) {
  const selection = window.getSelection();
  if (
    !selection.rangeCount ||
    selection.rangeCount === 0 ||
    !selection.focusNode
  ) {
    showToast("Please select a cell first.");
    return;
  }
  const parentCell = $(selection.focusNode).closest(".cell");
  if (parentCell.length === 0) {
    showToast("Please select a cell first.");
    return;
  }
  const range = selection.getRangeAt(0);
  range.deleteContents();

  if (data && data.latex) {
    const mathField = document.createElement("math-field");
    mathField.setValue(data.latex);
    mathField.readOnly = true;
    mathField.setAttribute("data-display-text", data.display || data.latex);
    range.insertNode(mathField);
    range.setStartAfter(mathField);
    range.setEndAfter(mathField);
    selection.removeAllRanges();
    selection.addRange(range);
    updateFormulaBarForCell(parentCell);
  } else if (typeof data === "string") {
    const textNode = document.createTextNode(data);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    updateFormulaBarForCell(parentCell);
  }
};

function updateFormulaBarForCell($cell) {
  if (!$cell || $cell.length === 0) {
    cellContentInput.value = "";
    return;
  }
  let displayText = "";
  $cell.contents().each(function () {
    if (this.nodeType === Node.TEXT_NODE) {
      displayText += this.textContent;
    } else if (this.tagName === "MATH-FIELD") {
      displayText += $(this).attr("data-display-text") || "[formula]";
    }
  });
  cellContentInput.value = displayText;
}
function handleCellSpillover(cell) {
  const $cell = $(cell);
  if (!$cell.length) return;

  // First, reset the width to its natural size within the grid
  $cell.css("width", "");

  // Check if the text content is actually wider than the cell's container
  if (cell.scrollWidth > cell.clientWidth) {
    let newWidth = cell.offsetWidth; // Start with the cell's own width
    let currentCol = $cell.data("col");
    let currentRow = $cell.data("row");
    let nextCol = currentCol + 1;

    // Look at the next cell to the right
    let $nextCell = $(`div.cell[data-col=${nextCol}][data-row=${currentRow}]`);

    // Keep expanding the calculated width as long as the next cell is empty
    // AND the text still needs more space.
    while (
      newWidth < cell.scrollWidth &&
      $nextCell.length > 0 &&
      $nextCell.text().trim() === ""
    ) {
      newWidth += $nextCell[0].offsetWidth; // Add the width of the empty cell
      nextCol++;
      $nextCell = $(`div.cell[data-col=${nextCol}][data-row=${currentRow}]`);
    }

    // Apply the newly calculated width to the focused cell
    // This will stretch the cell (and its border) over the empty cells
    $cell.css("width", `${newWidth}px`);
  }
}
$sheet.css("--col-count", cols);
$sheet.css("--row-count", rows);

function updateSheet(cols, rows) {
  $cellsWrapper.empty();
  $sheet.find(".ruler_cols").empty();
  $sheet.find(".ruler_rows").empty();
  for (let c = 1; c <= cols; c++) {
    $sheet
      .find(".ruler_cols")
      .append($(`<span/>`).attr("data-col", c).text(generateIndex(c)));
  }
  for (let r = 1; r <= rows; r++) {
    $sheet.find(".ruler_rows").append($(`<span/>`).attr("data-row", r).text(r));
  }
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const $cellWrapper = $('<div class="cell-wrapper"></div>')
        .css({ "--cell-col": c, "--cell-row": r })
        .attr({ "data-col": c, "data-row": r });
      const $cellDiv = $(
        '<div class="cell" contenteditable="true"></div>'
      ).attr({ "data-col": c, "data-row": r });
      $cellWrapper.append($cellDiv);
      $cellsWrapper.append($cellWrapper);
    }
  }
}

function generateIndex(num) {
  let index = "";
  for (; num > 0; num = Math.floor((num - 1) / 26)) {
    index = String.fromCharCode(((num - 1) % 26) + 97) + index;
  }
  return index.toUpperCase();
}

$(() => {
  updateSheet(cols, rows);
});

$(document).on("focusin", ".cell", function () {
  const $cell = $(this);
  lastFocusedCell = $cell;
  const col = $cell.data("col");
  const row = $cell.data("row");

  $(".ruler_cols > span, .ruler_rows > span").removeClass(
    "active-col active-row"
  );
  $(`.ruler_cols > span[data-col="${col}"]`).addClass("active-col");
  $(`.ruler_rows > span[data-row="${row}"]`).addClass("active-row");

  cellAddressInput.value = `${generateIndex(col)}${row}`;

  if (!activeMathSheetField) {
    updateFormulaBarForCell($cell);
  }
  // Call the new overflow handler when a cell gets focus
  handleCellSpillover(this);
});

// --- FIX #1: Use CLICK event to reliably set the cursor for insertion ---
$sheet.on("click", ".cell", function () {
  const cellElement = this;
  if (window.getSelection && document.createRange) {
    const range = document.createRange();
    range.selectNodeContents(cellElement);
    range.collapse(false); // false collapses to the end
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
});

$(document).on("input", "div.cell", function () {
  if ($(this).is(":focus")) {
    if (!activeMathSheetField) {
      updateFormulaBarForCell($(this));
    }
    // Also call the handler on input
    handleCellSpillover(this);
  }
});

cellContentInput.addEventListener("input", function () {
  if (activeMathSheetField) {
    activeMathSheetField.setValue(this.value);
  } else if (lastFocusedCell) {
    lastFocusedCell.text(this.value);
  }
});

// --- FIX #2: Add Keydown listener to handle deleting math fields ---
$sheet.on("keydown", ".cell", function (e) {
  if (e.key === "Backspace") {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      const container = range.startContainer;
      let nodeToDelete = null;

      if (range.startOffset === 0 && container.nodeType === Node.TEXT_NODE) {
        // Cursor is at the start of a text node, check previous sibling
        nodeToDelete = container.previousSibling;
      } else if (
        container.nodeType === Node.ELEMENT_NODE &&
        container.classList.contains("cell")
      ) {
        // Cursor is in the cell itself, check the node at the offset
        nodeToDelete = container.childNodes[range.startOffset - 1];
      }

      // If the node to delete is a math field, remove it manually
      if (nodeToDelete && nodeToDelete.tagName === "MATH-FIELD") {
        e.preventDefault();
        nodeToDelete.remove();
        updateFormulaBarForCell($(this));
      }
    }
  }
});

let currentRowCount = rows;
let currentColCount = cols;
const rowsPerBatch = 50;
const colsPerBatch = 21;

function addMoreRows() {
  const newRowsLimit = currentRowCount + rowsPerBatch;
  const $rulerRows = $sheet.find(".ruler_rows");
  for (let r = currentRowCount + 1; r <= newRowsLimit; r++) {
    $rulerRows.append($(`<span/>`).attr("data-row", r).text(r));
  }
  for (let r = currentRowCount + 1; r <= newRowsLimit; r++) {
    for (let c = 1; c <= currentColCount; c++) {
      const $cellWrapper = $('<div class="cell-wrapper"></div>')
        .css({ "--cell-col": c, "--cell-row": r })
        .attr({ "data-col": c, "data-row": r });
      const $cellDiv = $(
        '<div class="cell" contenteditable="true"></div>'
      ).attr({ "data-col": c, "data-row": r });
      $cellWrapper.append($cellDiv);
      $cellsWrapper.append($cellWrapper);
    }
  }
  currentRowCount = newRowsLimit;
  $sheet.css("--row-count", currentRowCount);
}

function addMoreColumns() {
  const newColsLimit = currentColCount + colsPerBatch;
  const $rulerCols = $sheet.find(".ruler_cols");
  for (let c = currentColCount + 1; c <= newColsLimit; c++) {
    $rulerCols.append($(`<span/>`).attr("data-col", c).text(generateIndex(c)));
  }
  for (let r = 1; r <= currentRowCount; r++) {
    for (let c = currentColCount + 1; c <= newColsLimit; c++) {
      const $cellWrapper = $('<div class="cell-wrapper"></div>')
        .css({ "--cell-col": c, "--cell-row": r })
        .attr({ "data-col": c, "data-row": r });
      const $cellDiv = $(
        '<div class="cell" contenteditable="true"></div>'
      ).attr({ "data-col": c, "data-row": r });
      $cellWrapper.append($cellDiv);
      $cellsWrapper.append($cellWrapper);
    }
  }
  currentColCount = newColsLimit;
  $sheet.css("--col-count", currentColCount);
}

$sheet.on("scroll", function () {
  if (this.scrollTop + this.clientHeight >= this.scrollHeight - 20) {
    addMoreRows();
  }
  if (this.scrollLeft + this.clientWidth >= this.scrollWidth - 20) {
    addMoreColumns();
  }
});

let isSelecting = false;
let startCell = null;
let endCell = null;

function toA1(col, row) {
  let colName = "";
  let num = col;
  while (num > 0) {
    let rem = (num - 1) % 26;
    colName = String.fromCharCode(65 + rem) + colName;
    num = Math.floor((num - 1) / 26);
  }
  return `${colName}${row}`;
}

function fromA1(a1) {
  const colMatch = a1.match(/[A-Z]+/i);
  const rowMatch = a1.match(/\d+/);
  if (!colMatch || !rowMatch) return null;
  let col = 0;
  const colName = colMatch[0].toUpperCase();
  for (let i = 0; i < colName.length; i++) {
    col = col * 26 + (colName.charCodeAt(i) - 64);
  }
  return { col, row: parseInt(rowMatch[0], 10) };
}

function getSelectedRange() {
  if (!startCell || !endCell) return null;
  const minCol = Math.min(startCell.col, endCell.col);
  const maxCol = Math.max(startCell.col, endCell.col);
  const minRow = Math.min(startCell.row, endCell.row);
  const maxRow = Math.max(startCell.row, endCell.row);
  const startA1 = toA1(minCol, minRow);
  const endA1 = toA1(maxCol, maxRow);
  return {
    minCol,
    maxCol,
    minRow,
    maxRow,
    rangeA1: startA1 === endA1 ? startA1 : `${startA1}:${endA1}`,
  };
}

function highlightSelection() {
  $(".cell").removeClass("selected");
  $(".ruler_cols > span, .ruler_rows > span").removeClass(
    "ruler-selected active-col active-row"
  );
  const range = getSelectedRange();
  if (range) {
    cellAddressInput.value = range.rangeA1;
    for (let c = range.minCol; c <= range.maxCol; c++) {
      for (let r = range.minRow; r <= range.maxRow; r++) {
        $(`div.cell[data-col=${c}][data-row=${r}]`).addClass("selected");
      }
    }
    for (let c = range.minCol; c <= range.maxCol; c++) {
      $(`.ruler_cols > span[data-col=${c}]`).addClass("ruler-selected");
    }
    for (let r = range.minRow; r <= range.maxRow; r++) {
      $(`.ruler_rows > span[data-row=${r}]`).addClass("ruler-selected");
    }
  }
}

$sheet.on("mousedown", ".cell", function (e) {
  isSelecting = true;
  const data = $(this).data();
  startCell = { col: data.col, row: data.row };
  endCell = { col: data.col, row: data.row };
  highlightSelection();
});

$sheet.on("mouseover", ".cell", function () {
  if (isSelecting) {
    const data = $(this).data();
    endCell = { col: data.col, row: data.row };
    highlightSelection();
  }
});

$(document).on("mouseup", () => {
  isSelecting = false;
});

$(document).on("focus", "div.cell", function () {
  const $cell = $(this);
  $(".cell").removeClass("is-focused");
  $cell.addClass("is-focused");
  if ($cell.data("formula")) {
    $cell.text($cell.data("formula"));
  }
});

$(document).on("blur", "div.cell", function () {
  const $cell = $(this);
  $cell.removeClass("is-focused");
  $cell.css("width", "");
  const content = $cell.text();
  if (content.startsWith("=")) {
    $cell.data("formula", content);
    const result = evaluateFormula(content, $cell);
    $cell.html(result);
  }
});

function resolveArgument(argStr, contextCell) {
  argStr = argStr.trim();

  // It's a string literal
  if (argStr.startsWith('"') && argStr.endsWith('"')) {
    return argStr.substring(1, argStr.length - 1);
  }

  // It's a number
  if (!isNaN(argStr) && isFinite(argStr)) {
    return parseFloat(argStr);
  }

  // It's a range or a single cell
  if (/^[A-Z]+\d+(:[A-Z]+\d+)?$/i.test(argStr)) {
    const rangeParts = argStr.split(":").map(fromA1);
    const start = rangeParts[0];
    const end = rangeParts.length > 1 ? rangeParts[1] : start;
    if (!start || !end) return [];

    const values = [];
    for (let c = start.col; c <= end.col; c++) {
      for (let r = start.row; r <= end.row; r++) {
        const $cell = $(`div.cell[data-col=${c}][data-row=${r}]`);
        // Prevent circular references to the formula cell itself
        if ($cell[0] !== contextCell[0]) {
          values.push($cell.text());
        }
      }
    }
    // If it was a single cell reference, return the single value, not an array
    return argStr.includes(":") ? values : values[0];
  }

  // Could be a boolean or other literal
  if (argStr.toUpperCase() === "TRUE") return true;
  if (argStr.toUpperCase() === "FALSE") return false;

  // If we can't figure it out, return the string itself
  return argStr;
}

/**
 * Parses a formula string to extract the function name and arguments.
 * @param {string} formula The formula string (e.g., "=SUM(A1:B5)").
 * @returns {object|null} An object with `funcName` and `args` array, or null if invalid.
 */
function parseFormula(formula) {
  const match = formula.match(/=\s*([A-Z\.]+)\s*\((.*)\)/i);
  if (!match) return null;

  const funcName = match[1].toUpperCase();
  const argsStr = match[2];

  // Handle no-argument functions like TODAY()
  if (argsStr.trim() === "") {
    return { funcName, args: [] };
  }

  // Basic split on comma. This is a simplification and won't handle commas inside strings.
  const args = argsStr.split(",").map((arg) => arg.trim());

  return { funcName, args };
}

/**
 * Evaluates a formula from a cell.
 * @param {string} formula The formula string.
 * @param {jQuery} $cell The jQuery object for the cell containing the formula.
 * @returns {any} The result of the formula evaluation.
 */
function evaluateFormula(formula, $cell) {
  const parsed = parseFormula(formula);
  if (!parsed) return formula; // Return original text if not a valid formula format

  const { funcName, args } = parsed;
  const resolvedArgs = args.map((arg) => resolveArgument(arg, $cell));

  // Helper to extract numeric values from resolved args that might be ranges
  const getNumericValues = (argsArray) => {
    let values = [];
    argsArray.forEach((arg) => {
      if (Array.isArray(arg)) {
        values = values.concat(arg);
      } else {
        values.push(arg);
      }
    });
    return values.map(parseFloat).filter((n) => !isNaN(n));
  };
  // Helper to extract all non-empty values
  const getAllValues = (argsArray) => {
    let values = [];
    argsArray.forEach((arg) => {
      if (Array.isArray(arg)) {
        values = values.concat(arg);
      } else {
        values.push(arg);
      }
    });
    return values.filter(
      (v) => v !== null && v !== undefined && String(v).trim() !== ""
    );
  };

  switch (funcName) {
    // --- Mathematical Functions ---
    case "SUM":
      return getNumericValues(resolvedArgs).reduce((acc, val) => acc + val, 0);
    case "AVERAGE":
      const avgNums = getNumericValues(resolvedArgs);
      return avgNums.length
        ? avgNums.reduce((acc, val) => acc + val, 0) / avgNums.length
        : 0;
    case "ROUND":
      return parseFloat(resolvedArgs[0]).toFixed(resolvedArgs[1] || 0);
    case "ABS":
      return Math.abs(parseFloat(resolvedArgs[0]));
    case "INT":
      return Math.floor(parseFloat(resolvedArgs[0]));
    case "MOD":
      return parseFloat(resolvedArgs[0]) % parseFloat(resolvedArgs[1]);
    case "POWER":
      return Math.pow(parseFloat(resolvedArgs[0]), parseFloat(resolvedArgs[1]));

    // --- Statistical Functions ---
    case "COUNT":
      return getNumericValues(resolvedArgs).length;
    case "COUNTA":
      return getAllValues(resolvedArgs).length;
    case "MAX":
      return Math.max(...getNumericValues(resolvedArgs));
    case "MIN":
      return Math.min(...getNumericValues(resolvedArgs));
    case "MEDIAN":
      const medianNums = getNumericValues(resolvedArgs).sort((a, b) => a - b);
      const mid = Math.floor(medianNums.length / 2);
      return medianNums.length % 2 !== 0
        ? medianNums[mid]
        : (medianNums[mid - 1] + medianNums[mid]) / 2;

    // --- Text Functions ---
    case "CONCAT":
      return resolvedArgs.join("");
    case "LEFT":
      return String(resolvedArgs[0]).substring(0, resolvedArgs[1]);
    case "RIGHT":
      return String(resolvedArgs[0]).substring(
        String(resolvedArgs[0]).length - resolvedArgs[1]
      );
    case "LEN":
      return String(resolvedArgs[0]).length;
    case "UPPER":
      return String(resolvedArgs[0]).toUpperCase();
    case "LOWER":
      return String(resolvedArgs[0]).toLowerCase();
    case "TRIM":
      return String(resolvedArgs[0]).trim();

    // --- Date/Time Functions ---
    case "TODAY":
      const today = new Date();
      return today.toLocaleDateString(); // Format as MM/DD/YYYY or similar
    case "NOW":
      return new Date().toLocaleString(); // Format as MM/DD/YYYY, hh:mm:ss AM/PM
    case "DATE":
      // Note: JS month is 0-indexed, so we subtract 1
      return new Date(
        resolvedArgs[0],
        resolvedArgs[1] - 1,
        resolvedArgs[2]
      ).toLocaleDateString();

    // --- Logical Functions (Simplified) ---
    // Note: A full implementation would require a proper expression evaluator.
    // This is a simplified version.
    case "IF":
      // Super simple evaluator for "A1>5" or "A1="Hello"" style conditions
      let condition = false;
      const conditionStr = String(args[0]); // Use the unresolved argument string
      const parts = conditionStr.match(
        /([A-Z]+\d+)\s*(>|<|=|>=|<=|<>)\s*(.*)/i
      );
      if (parts) {
        const cellVal = resolveArgument(parts[1], $cell);
        const operator = parts[2];
        const compareVal = resolveArgument(parts[3], $cell);
        switch (operator) {
          case ">":
            condition = cellVal > compareVal;
            break;
          case "<":
            condition = cellVal < compareVal;
            break;
          case "=":
            condition = cellVal == compareVal;
            break;
          case ">=":
            condition = cellVal >= compareVal;
            break;
          case "<=":
            condition = cellVal <= compareVal;
            break;
          case "<>":
            condition = cellVal != compareVal;
            break;
        }
      } else {
        condition = !!resolvedArgs[0]; // Evaluate truthiness
      }
      return condition ? resolvedArgs[1] : resolvedArgs[2];

    default:
      return "#NAME?"; // Function not recognized
  }
}

function findTargetAndRange(selectedRange) {
  if (!selectedRange) return null;
  const dataCells = [],
    emptyCells = [];
  for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      const cell = $(`div.cell[data-col=${c}][data-row=${r}]`);
      if (cell.text().trim() === "") {
        emptyCells.push(cell);
      } else {
        dataCells.push(cell);
      }
    }
  }
  if (emptyCells.length > 0 && dataCells.length > 0) {
    const targetCell = emptyCells[0];
    const firstDataCell = dataCells[0].data();
    const lastDataCell = dataCells[dataCells.length - 1].data();
    const dataRange =
      toA1(firstDataCell.col, firstDataCell.row) +
      ":" +
      toA1(lastDataCell.col, lastDataCell.row);
    return { target: targetCell, range: dataRange };
  }
  return null;
}

$(".dropdown-menu-math").on("click", ".submenu button", function (e) {
  e.preventDefault();
  e.stopPropagation();
  if (!lastFocusedCell) {
    alert("Please select a cell first.");
    return;
  }
  const functionName = $(this).text().split(" ")[0];
  const selectedRange = getSelectedRange();
  let targetCell = lastFocusedCell;
  let formulaRange = selectedRange
    ? selectedRange.rangeA1
    : toA1(targetCell.data("col"), targetCell.data("row"));
  const smartTarget = findTargetAndRange(selectedRange);
  if (smartTarget) {
    targetCell = smartTarget.target;
    formulaRange = smartTarget.range;
  }
  const formula = `=${functionName}(${formulaRange})`;
  targetCell.text(formula).focus();
  cellContentInput.value = formula;
  $(".dropdown-menu-math").removeClass("show");
  $("#matematicalEquation")
    .closest(".dropdown-select")
    .removeClass("open active-category");
});

$("#sort-asc-btn, #sort-desc-btn").on("click", function () {
  const sortOrder = $(this).attr("id") === "sort-asc-btn" ? "asc" : "desc";
  $("#sort-asc-btn, #sort-desc-btn").removeClass("active-sort-button");
  $(this).addClass("active-sort-button");
  const $activeTab = $("#filter-column-tabs .filter-tab.active");
  if ($activeTab.length === 0) {
    alert("Please select a column tab to sort.");
    return;
  }
  const col = $activeTab.data("col");
  const headerRow = 1;
  const rowsToSort = [];
  for (let r = headerRow + 1; r <= currentRowCount; r++) {
    const cellValue = $(`.cell[data-col=${col}][data-row=${r}]`).text();
    rowsToSort.push({ row: r, value: cellValue || "" });
  }
  rowsToSort.sort((a, b) => {
    const valA = a.value,
      valB = b.value,
      options = { numeric: true, sensitivity: "base" };
    const aIsEmpty = valA === "",
      bIsEmpty = valB === "";
    if (aIsEmpty && bIsEmpty) return 0;
    if (aIsEmpty) return 1;
    if (bIsEmpty) return -1;
    if (sortOrder === "asc") {
      return valA.localeCompare(valB, undefined, options);
    } else {
      return valB.localeCompare(valA, undefined, options);
    }
  });
  const $cellsWrapper = $("#cells_wrapper");
  rowsToSort.forEach((sortedItem) => {
    const $rowElements = $cellsWrapper.find(
      `.cell-wrapper[data-row=${sortedItem.row}]`
    );
    $cellsWrapper.append($rowElements);
  });
});

$("#sizemug_lfilter--btn").on("click", function () {
  const $filterBtn = $(this);
  const selectedRange = getSelectedRange();
  if (!selectedRange) {
    alert("Please select the table or header row you want to filter.");
    return;
  }
  const headerRow = selectedRange.minRow;
  for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
    const $wrapper = $(`.cell-wrapper[data-col=${c}][data-row=${headerRow}]`);
    if ($wrapper.find(".cell-filter-icon").length === 0) {
      $wrapper.append(
        $(
          `<span class="cell-filter-icon"><svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.3333 1.66699H1.66667L5.40001 6.64479C5.5731 6.87559 5.66667 7.15626 5.66667 7.44479V12.3337L8.33334 11.0003V7.44479C8.33334 7.15626 8.42694 6.87559 8.6 6.64479L12.3333 1.66699Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></span>`
        )
      );
    }
    $wrapper.toggleClass("filter-enabled");
  }
  if ($(".cell-wrapper.filter-enabled").length > 0) {
    $filterBtn.addClass("active-category");
  } else {
    $filterBtn.removeClass("active-category");
  }
});

function populateFilterValues(col, headerRow) {
  const uniqueValues = new Set();
  for (let r = headerRow + 1; r <= currentRowCount; r++) {
    const cellValue = $(`.cell[data-col=${col}][data-row=${r}]`).text();
    if (cellValue.trim() !== "") uniqueValues.add(cellValue);
  }
  const $valuesList = $("#filter-values-list").empty();
  uniqueValues.forEach((value) => {
    $valuesList.append(
      $(
        `<label class="filter-value-item">${value}<input type="checkbox" checked value="${value}"><span class="custom-checkmark"></span></label>`
      )
    );
  });
}

function openFilterPane(colToActivate, headerRow) {
  const $tabsContainer = $("#filter-column-tabs");
  const headerText = $(
    `.cell[data-col=${colToActivate}][data-row=${headerRow}]`
  ).text();
  let $tab = $tabsContainer.find(`.filter-tab[data-col=${colToActivate}]`);
  if ($tab.length === 0) {
    $tab = $(
      `<button class="filter-tab" data-col="${colToActivate}">${headerText}</button>`
    );
    $tabsContainer.append($tab);
  }
  $tabsContainer.find(".filter-tab").removeClass("active");
  $tab.addClass("active");
  populateFilterValues(colToActivate, headerRow);
  $("#filter-pane").addClass("open");
}

$("#spreadsheet").on("click", ".cell-filter-icon", function (e) {
  e.stopPropagation();
  $(this).addClass("filter-active");
  const $wrapper = $(this).closest(".cell-wrapper");
  openFilterPane($wrapper.data("col"), $wrapper.data("row"));
});

$("#filter-column-tabs").on("click", ".filter-tab", function () {
  openFilterPane($(this).data("col"), 1);
});

$("#filter-cancel-btn").on("click", function () {
  $("#filter-pane").removeClass("open");
});

$("#filter-save-btn").on("click", function () {
  const $activeTab = $("#filter-column-tabs .filter-tab.active");
  if ($activeTab.length === 0) return;
  const col = $activeTab.data("col");
  const allowedValues = new Set();
  $("#filter-values-list input:checked").each(function () {
    allowedValues.add($(this).val());
  });
  for (let r = 2; r <= currentRowCount; r++) {
    const cellValue = $(`.cell[data-col=${col}][data-row=${r}]`).text();
    const $rowWrappers = $(`.cell-wrapper[data-row=${r}]`);
    if (allowedValues.has(cellValue) || cellValue.trim() === "") {
      $rowWrappers.css("display", "grid");
    } else {
      $rowWrappers.css("display", "none");
    }
  }
  $("#filter-pane").removeClass("open");
});

// --- Row Height Adjustment Functionality (v3 - Fully Synchronized) ---

const DEFAULT_ROW_HEIGHT = 32; // 2rem is often 32px. Adjust if needed.
const ROW_HEIGHT_STEP = 20; // How much to increase/decrease by

/**
 * Updates the height for a specific row by modifying the grid definitions
 * for both the ruler and the main spreadsheet wrapper.
 * @param {number} row The 1-based index of the row to resize.
 * @param {number} newHeight The target height in pixels.
 */
function updateRowHeight(row, newHeight) {
  const $rulerRows = $(".ruler_rows");
  const $cellsWrapper = $("#cells_wrapper");

  // --- 1. Update the Row Ruler's Grid Definition ---
  const rulerGridRows = $rulerRows.css("grid-template-rows").split(" ");
  if (row - 1 < rulerGridRows.length) {
    rulerGridRows[row - 1] = `${newHeight}px`;
    $rulerRows.css("grid-template-rows", rulerGridRows.join(" "));
  }

  // --- 2. Update the Cells Wrapper's Grid Definition ---
  const wrapperGridRows = $cellsWrapper.css("grid-template-rows").split(" ");
  if (row - 1 < wrapperGridRows.length) {
    wrapperGridRows[row - 1] = `${newHeight}px`;
    $cellsWrapper.css("grid-template-rows", wrapperGridRows.join(" "));
  }
}

// Event listener for the increase height button
$("#addingHeight").on("click", function () {
  if (!lastFocusedCell) {
    alert("Please select a cell first.");
    return;
  }
  const row = lastFocusedCell.data("row");
  // Get current height from one of the grid definitions (they should be the same)
  const currentHeight = parseFloat(
    $(".ruler_rows").css("grid-template-rows").split(" ")[row - 1]
  );
  const newHeight = currentHeight + ROW_HEIGHT_STEP;

  updateRowHeight(row, newHeight);
});

// --- REPLACE your old keydown listener with this one ---
$sheet.on("keydown", ".cell", function (e) {
  // We only care about the Backspace key for this functionality.
  if (e.key !== "Backspace") {
    return;
  }

  // A reference to the cell being edited.
  const $cell = $(this);

  // --- Part 1: Handle synchronous deletion of special elements ---
  // This part for deleting math-fields must run immediately.
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      let nodeToDelete = null;
      if (
        range.startOffset === 0 &&
        range.startContainer.nodeType === Node.TEXT_NODE
      ) {
        nodeToDelete = range.startContainer.previousSibling;
      } else if (
        range.startContainer.nodeType === Node.ELEMENT_NODE &&
        range.startContainer.classList.contains("cell")
      ) {
        nodeToDelete = range.startContainer.childNodes[range.startOffset - 1];
      }
      if (nodeToDelete && nodeToDelete.tagName === "MATH-FIELD") {
        e.preventDefault();
        nodeToDelete.remove();
        updateFormulaBarForCell($cell);
      }
    }
  }

  // --- Part 2: Schedule the smart height decrease ---
  // We use a `setTimeout` of 0. This is a standard JavaScript trick to wait
  // for the browser to finish its current task (deleting the character)
  // before our code runs.
  setTimeout(() => {
    // Make sure the cell wasn't deleted from the page entirely.
    if (!$cell.closest(document.documentElement).length) return;

    // --- Measure the content's new height (same logic as before) ---
    $cell.css("white-space", "normal");
    const contentHeight = $cell[0].scrollHeight + 4; // Add 4px for padding
    $cell.css("white-space", "nowrap"); // IMPORTANT: Restore for text spillover

    const row = $cell.data("row");
    const currentRowHeight = parseFloat(
      $(".ruler_rows").css("grid-template-rows").split(" ")[row - 1]
    );

    // Calculate the height the content now requires (cannot be smaller than default).
    const newRequiredHeight = Math.max(DEFAULT_ROW_HEIGHT, contentHeight);

    // --- THE CRITICAL LOGIC ---
    // We only update the row height if the content now fits in a SMALLER space
    // than the current row height. This prevents this code from ever increasing the height.
    if (newRequiredHeight < currentRowHeight) {
      updateRowHeight(row, newRequiredHeight);
    }
  }, 0);
});
