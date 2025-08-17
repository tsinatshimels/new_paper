// --- START: sheet.js (Final Version with Insertion and Deletion Fixes) ---

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

  function setMode(mode) {
    window.currentEditorMode = mode;
    updateDropdownText(mode);
    if (mode !== "true") {
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
    } else {
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

  function updateDropdownText(mode) {
    const wordDropdown = document.getElementById("exportWord--dropdown");
    const sheetDropdown = document.getElementById("exportSheet--dropdown");
    if (mode === "true") {
      dropdownSelectButton.innerHTML = `
        <div style="display: flex; align-items: center; gap: 4px;">
            <img src="./icons/word-icon.svg" style="width: 18px; height: 18px; vertical-align: middle;" />
            <span>Docs</span>
        </div>`;
      sheetDropdown.classList.add("paper--hidden");
      wordDropdown.classList.remove("paper--hidden");
    } else if (mode === "false") {
      dropdownSelectButton.innerHTML = `
        <div style="display: flex; align-items: center; gap: 4px;">
            <img src="./icons/sheet_icon.svg" style="width: 18px; height: 18px; vertical-align: middle;" />
            <span>Sheet</span>
        </div>`;
      wordDropdown.classList.add("paper--hidden");
      sheetDropdown.classList.remove("paper--hidden");
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
  if ($(this).is(":focus") && !activeMathSheetField) {
    updateFormulaBarForCell($(this));
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
  const content = $cell.text();
  if (content.startsWith("=")) {
    $cell.data("formula", content);
    const result = evaluateFormula(content);
    $cell.html(result);
  }
});

function evaluateFormula(formula) {
  const match = formula.match(/=\s*([A-Z]+)\s*\(([^)]+)\)/i);
  if (!match) return formula;
  const funcName = match[1].toUpperCase();
  const rangeStr = match[2];
  const rangeParts = rangeStr.split(":").map(fromA1);
  const start = rangeParts[0];
  const end = rangeParts.length > 1 ? rangeParts[1] : start;
  if (!start || !end) return "#ERROR!";
  const values = [];
  for (let c = start.col; c <= end.col; c++) {
    for (let r = start.row; r <= end.row; r++) {
      const cellValue = $(`div.cell[data-col=${c}][data-row=${r}]`).text();
      if (
        $(`div.cell[data-col=${c}][data-row=${r}]`).data("formula") !== formula
      ) {
        const numValue = parseFloat(cellValue);
        if (!isNaN(numValue)) values.push(numValue);
      }
    }
  }
  switch (funcName) {
    case "SUM":
      return values.reduce((acc, val) => acc + val, 0);
    case "AVERAGE":
      return values.length
        ? values.reduce((acc, val) => acc + val, 0) / values.length
        : 0;
    case "COUNT":
      return values.length;
    case "MAX":
      return Math.max(...values);
    case "MIN":
      return Math.min(...values);
    default:
      return "#NAME?";
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
