let buttonsToDisable = [
  // Original buttons
  "sizemug_emoji--btn",
  "sizemug_boomark--btn",
  // "import_media--tools",
  "add_bar_chart",
  "import_video_tool",
  "add_line_chart",
  "sizemug_add_horizontal_line--btn",
  // "sizemug_equation--btn",
  "add_pie_chart",
  "sizemug_quotation--btn",
  "sizemug_citation--btn", // Already included in original list
  "sizemug_special_characters--btn",
  "sizemug_add_date--btn",

  // Shape/Table/Grid buttons
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

  // Additional buttons you requested
  "sizemug_frame--btn",
];

document.addEventListener("DOMContentLoaded", () => {
  const sheetTools = document.getElementById("sheet_tools");
  const mainWhitePaperBoard = document.getElementById("main_white_paper_board");
  const dropdownSelectButton = document.querySelector(
    "#SheetToDocsDropdown .dropdown-select button"
  );
  let currentMode = "true"; // Initial mode: Sheet

  // Function to update dropdown-select text and apply mode
  function setMode(mode) {
    currentMode = mode;
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

  // function updateDropdownText(mode) {
  //   if (mode === "true") {
  //     dropdownSelectButton.innerHTML = `
  //     <div style="display: flex; align-items: center; gap: 4px;">
  //       <img src="./icons/word-icon.svg" style="width: 18px; height: 18px; vertical-align: middle;" />
  //       <span>Word</span>
  //     </div>
  //   `;

  //   } else if (mode === "false") {
  //     dropdownSelectButton.innerHTML = `
  //       <div style="display: flex; align-items: center; gap: 4px;">
  //         <img src="./icons/sheet_icon.svg" style="width: 18px; height: 18px; vertical-align: middle;" />
  //         <span>Sheet</span>
  //       </div>
  //   `;
  //   }
  // }

  function updateDropdownText(mode) {
    const wordDropdown = document.getElementById("exportWord--dropdown");
    const sheetDropdown = document.getElementById("exportSheet--dropdown");
    const exportButton = document.getElementById("exportButton");
    const dropdownSelect = document.querySelector(".dropdown-select");

    if (mode === "true") {
      // Show Word dropdown content
      dropdownSelectButton.innerHTML = `
            <div style="display: flex; align-items: center; gap: 4px;">
                <img src="./icons/word-icon.svg" style="width: 18px; height: 18px; vertical-align: middle;" />
                <span>Word</span>
            </div>
        `;

      // Hide sheet dropdown and show word dropdown
      sheetDropdown.classList.add("paper--hidden");
      wordDropdown.classList.remove("paper--hidden");

      // Update dropdown instance
      const dropdown = document.getElementById("exportWordSheet");
      if (dropdown.dropdownInstance) {
        dropdown.dropdownInstance.menu = wordDropdown;
      }
    } else if (mode === "false") {
      // Show Sheet dropdown content
      dropdownSelectButton.innerHTML = `
            <div style="display: flex; align-items: center; gap: 4px;">
                <img src="./icons/sheet_icon.svg" style="width: 18px; height: 18px; vertical-align: middle;" />
                <span>Sheet</span>
            </div>
        `;

      // Hide word dropdown and show sheet dropdown
      wordDropdown.classList.add("paper--hidden");
      sheetDropdown.classList.remove("paper--hidden");

      // Update dropdown instance
      const dropdown = document.getElementById("exportWordSheet");
      if (dropdown.dropdownInstance) {
        dropdown.dropdownInstance.menu = sheetDropdown;
      }
    }
  }

  // Initialize with default state (Sheet)
  // updateDropdownText("false");

  // Initialize with Sheet mode
  setMode(currentMode);

  // Add event listeners for dropdown items
  document.querySelector("#docsButton").addEventListener("click", () => {
    if (currentMode !== "true") {
      setMode("true");
    }
  });

  document.querySelector("#sheetButton").addEventListener("click", () => {
    if (currentMode !== "false") {
      setMode("false");
    }
  });

  // Optional: Add click event to dropdown-select to toggle dropdown menu (if not already handled by CSS)
  const dropdown = document.getElementById("SheetToDocsDropdown");
  const dropdownMenu = dropdown.querySelector(".dropdown-menu");
  // dropdownSelectButton.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   dropdownMenu.style.display =
  //     dropdownMenu.style.display === "block" ? "none" : "block";
  // });
});

function generateCellInput() {
  const cellInputsLengths = Array.from({ length: 1050 }, (_, i) => i + 1);

  cellInputsLengths.forEach((cell) => {
    const markup = `<input type="text" class="cell" data-col="1" data-row="1" style="--cell-col: 1; --cell-row: 1" />`;
  });
}

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
const cols = 21;
const rows = 50;

const $sheet = $("#spreadsheet");

$sheet.css("--col-count", cols);
$sheet.css("--row-count", rows);

/**
 * update the spreadsheet
 * @param {number} cols - column count
 * @param {number} rows - row count
 */
function updateSheet(cols, rows, reverseRows = false, reverseCols = false) {
  const $cellsWrapper = $sheet.find("#cells_wrapper");
  const $rulerCols = $sheet.find(".ruler_cols");
  const $rulerRows = $sheet.find(".ruler_rows");
  const chars = "ABCDEFGHIJKLMNOPQRST";

  // Clear existing content
  $rulerCols.empty();
  $rulerRows.empty();
  $cellsWrapper.empty();

  // Handle column ruler and cells
  const colStart = reverseCols ? cols : 1;
  const colEnd = reverseCols ? 0 : cols;
  const colStep = reverseCols ? -1 : 1;
  for (let c = colStart; c !== colEnd + colStep; c += colStep) {
    const $cell = $(`<span/>`).attr("data-col", c).text(generateIndex(c));
    $rulerCols.append($cell);
  }

  // Handle row ruler
  const rowStart = reverseRows ? rows : 1;
  const rowEnd = reverseRows ? 0 : rows;
  const rowStep = reverseRows ? -1 : 1;
  for (let r = rowStart; r !== rowEnd + rowStep; r += rowStep) {
    const $cell = $(`<span/>`).attr("data-row", r).text(r);
    $rulerRows.append($cell);
  }

  // Handle cells
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      // 1. Create the wrapper
      const $cellWrapper = $('<div class="cell-wrapper"></div>')
        .css("--cell-col", c)
        .css("--cell-row", r)
        .attr("data-col", c)
        .attr("data-row", r);

      // 2. Create the input cell
      const $cellInput = $('<input type="text" class="cell" />')
        .attr("data-col", c)
        .attr("data-row", r);

      // 3. Append input to wrapper, and wrapper to the sheet
      $cellWrapper.append($cellInput);
      $cellsWrapper.append($cellWrapper);
    }
  }
}
/**
 * generates alpha numertic index
 * @param {number} num - index of the column
 */
function generateIndex(num) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let index = "";
  while (num > 0) {
    index = letters.at((num - 1) % 26) + index;
    num = Math.floor((num - 1) / 26);
  }
  return index;
}

$(() => {
  updateSheet(cols, rows);
});

//Trigger row and column ordering functionalities
$(() => {
  $("#rowReverse").on("click", () => updateSheet(cols, rows, true, false));
  $("#columnReverse").on("click", () => updateSheet(cols, rows, false, true));
  $("#rowNormal").on("click", () => updateSheet(cols, rows, false, false));
  $("#columnNormal").on("click", () => updateSheet(cols, rows, false, false));
});

$(document).on("keydown", "input.cell[data-col][data-row]", (event) => {
  const $input = $(event.currentTarget);

  const col = Number($input.attr("data-col"));
  const row = Number($input.attr("data-row"));
  // configure behavior on press enter key
  if (event.which === 13 || event.key === "Enter") {
    const nextRow = event.shiftKey ? row - 1 : row + 1;
    // change focus to next or previous row
    $input
      .parent()
      .find(`input.cell[data-row=${nextRow}][data-col=${col}]`)
      .trigger("focus");
    event.preventDefault();
  }
});

// Handle cell focus
$(document).on("focus", "input.cell[data-col][data-row]", function () {
  const $input = $(this);
  const col = $input.attr("data-col");
  const row = $input.attr("data-row");

  // Remove previous highlights
  $(".ruler_cols > span").removeClass("active-col");
  $(".ruler_rows > span").removeClass("active-row");

  // Highlight current column header (letter)
  $(`.ruler_cols > span[data-col="${col}"]`).addClass("active-col");

  // Highlight current row header (number)
  $(`.ruler_rows > span[data-row="${row}"]`).addClass("active-row");
});

// Optional: Clear highlights when losing focus
// $(document).on('blur', 'input.cell', function() {
//   $('.ruler_cols > span, .ruler_rows > span').removeClass('active-col active-row');
// });
// Get references to the input elements
const cellAddressInput = document.querySelector('nav input[placeholder="A2"]');
const cellContentInput = document.querySelector("nav label input");

// Update the address input when a cell is focused
$(document).on("focus", "input.cell[data-col][data-row]", function () {
  const $input = $(this);
  const col = Number($input.attr("data-col"));
  const row = Number($input.attr("data-row"));

  // Convert column number to letter (1 -> A, 2 -> B, etc.)
  const colLetter = String.fromCharCode(64 + col);

  // Update the address input
  cellAddressInput.value = `${colLetter}${row}`;

  // Update the content input with the cell's current value
  cellContentInput.value = $input.val();
});

// Update cell content when typing in the formula bar
cellContentInput.addEventListener("input", function () {
  const activeCell = document.querySelector("input.cell:focus");
  if (activeCell) {
    activeCell.value = this.value;
  }
});

// Update formula bar when typing directly in a cell
$(document).on("input", "input.cell", function () {
  const activeCell = document.querySelector("input.cell:focus");
  if (activeCell === this) {
    cellContentInput.value = this.value;
  }
});

// Handle the Fx button if needed
document.querySelector("nav button").addEventListener("click", function () {
  // Add any formula-specific functionality here
  console.log("Formula button clicked");
});

// For selection and math equation functionality
$(() => {
  // --- SETUP & STATE MANAGEMENT ---
  let isSelecting = false;
  let startCell = null;
  let endCell = null;
  let lastFocusedCell = null;

  // --- HELPER FUNCTIONS ---
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

  // --- SELECTION LOGIC ---
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

  // --- In your selection logic section ---

  function highlightSelection() {
    // Clear previous cell selections
    $(".cell").removeClass("selected");

    // NEW: Clear all previous ruler highlights (both for selection and single focus)
    $(".ruler_cols > span, .ruler_rows > span").removeClass(
      "ruler-selected active-col active-row"
    );

    const range = getSelectedRange();

    // If a valid selection range exists...
    if (range) {
      // 1. Highlight all the cells in the range (Existing Logic)
      for (let c = range.minCol; c <= range.maxCol; c++) {
        for (let r = range.minRow; r <= range.maxRow; r++) {
          $(`input.cell[data-col=${c}][data-row=${r}]`).addClass("selected");
        }
      }

      // 2. NEW: Highlight all the corresponding column rulers
      for (let c = range.minCol; c <= range.maxCol; c++) {
        $(`.ruler_cols > span[data-col=${c}]`).addClass("ruler-selected");
      }

      // 3. NEW: Highlight all the corresponding row rulers
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

  // --- FORMULA & CELL INTERACTION LOGIC ---
  $(document).on("focus", "input.cell", function () {
    const $cell = $(this);
    lastFocusedCell = $cell;
    if ($cell.data("formula")) {
      $cell.val($cell.data("formula"));
    }
    // Ruler highlighting...
    const col = $cell.attr("data-col");
    const row = $cell.attr("data-row");
    $(".ruler_cols > span, .ruler_rows > span").removeClass(
      "active-col active-row"
    );
    $(`.ruler_cols > span[data-col="${col}"]`).addClass("active-col");
    $(`.ruler_rows > span[data-row="${row}"]`).addClass("active-row");
  });

  $(document).on("blur", "input.cell", function () {
    const $cell = $(this);
    const content = $cell.val();
    if (content.startsWith("=")) {
      $cell.data("formula", content);
      const result = evaluateFormula(content);
      $cell.val(result);
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
        const cellValue = $(`input.cell[data-col=${c}][data-row=${r}]`).val();
        if (
          $(`input.cell[data-col=${c}][data-row=${r}]`).data("formula") !==
          formula
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

  // --- NEW: Smart function to find where the formula should go and what it should sum ---
  function findTargetAndRange(selectedRange) {
    if (!selectedRange) return null;

    const dataCells = [];
    const emptyCells = [];

    for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
      for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
        const cell = $(`input.cell[data-col=${c}][data-row=${r}]`);
        if (cell.val().trim() === "") {
          emptyCells.push(cell);
        } else {
          dataCells.push(cell);
        }
      }
    }

    // The "smart" condition: we have both empty cells for the result and data cells to calculate.
    if (emptyCells.length > 0 && dataCells.length > 0) {
      const targetCell = emptyCells[0]; // Target the first empty cell

      // Find the min/max range of the data cells only
      const firstDataCell = dataCells[0].data();
      const lastDataCell = dataCells[dataCells.length - 1].data();
      const dataRange =
        toA1(firstDataCell.col, firstDataCell.row) +
        ":" +
        toA1(lastDataCell.col, lastDataCell.row);

      return {
        target: targetCell,
        range: dataRange,
      };
    }

    // Fallback for all other cases
    return null;
  }

  // --- DROPDOWN MENU INTEGRATION (UPDATED) ---
  $(".dropdown-menu-math").on("click", ".submenu button", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!lastFocusedCell) {
      alert("Please select a cell first.");
      return;
    }

    const functionName = $(this).text().split(" ")[0];
    const selectedRange = getSelectedRange();

    let targetCell = lastFocusedCell; // Default target
    let formulaRange = selectedRange
      ? selectedRange.rangeA1
      : toA1(targetCell.data("col"), targetCell.data("row")); // Default range

    // Try to use our new smart function
    const smartTarget = findTargetAndRange(selectedRange);
    if (smartTarget) {
      targetCell = smartTarget.target;
      formulaRange = smartTarget.range;
    }

    const formula = `=${functionName}(${formulaRange})`;

    targetCell.val(formula).focus(); // Place formula and focus the cell
    cellContentInput.value = formula; // Update the top formula bar

    // Manually close the dropdown
    $(".dropdown-menu-math").removeClass("show");
    $("#matematicalEquation")
      .closest(".dropdown-select")
      .removeClass("open active-category");
  });

  // 1. Main Filter Button: Toggle filtering on the selected header row
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
        const filterIcon = $(`
                <span class="cell-filter-icon">
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.3333 1.66699H1.66667L5.40001 6.64479C5.5731 6.87559 5.66667 7.15626 5.66667 7.44479V12.3337L8.33334 11.0003V7.44479C8.33334 7.15626 8.42694 6.87559 8.6 6.64479L12.3333 1.66699Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                </span>
            `);
        $wrapper.append(filterIcon);
      }
      $wrapper.toggleClass("filter-enabled");
    }

    // **FIX 2:** After toggling, check if any filters are active and style the button.
    if ($(".cell-wrapper.filter-enabled").length > 0) {
      $filterBtn.addClass("active-category");
    } else {
      $filterBtn.removeClass("active-category");
    }
  });

  // **FIX 1:** Function to populate the values list for the ACTIVE tab
  function populateFilterValues(col, headerRow) {
    const headerText = $(`.cell[data-col=${col}][data-row=${headerRow}]`).val();
    const uniqueValues = new Set();
    const totalRows = 50;
    for (let r = headerRow + 1; r <= totalRows; r++) {
      const cellValue = $(`.cell[data-col=${col}][data-row=${r}]`).val();
      if (cellValue.trim() !== "") uniqueValues.add(cellValue);
    }

    const $valuesList = $("#filter-values-list").empty();
    uniqueValues.forEach((value) => {
      const itemHTML = `
        <label class="filter-value-item">
            ${value}
            <input type="checkbox" checked value="${value}">
            <span class="custom-checkmark"></span>
        </label>`;
      $valuesList.append(itemHTML);
    });
  }

  // 2. In-Cell Filter Icon or Tab Click: Open/update the filter pane
  function openFilterPane(colToActivate, headerRow) {
    // A. Manage Tabs
    const $tabsContainer = $("#filter-column-tabs");
    const headerText = $(
      `.cell[data-col=${colToActivate}][data-row=${headerRow}]`
    ).val();
    let $tab = $tabsContainer.find(`.filter-tab[data-col=${colToActivate}]`);

    // If tab doesn't exist, create it
    if ($tab.length === 0) {
      $tab = $(
        `<button class="filter-tab" data-col="${colToActivate}">${headerText}</button>`
      );
      $tabsContainer.append($tab);
    }

    // Set the clicked/created tab to active
    $tabsContainer.find(".filter-tab").removeClass("active");
    $tab.addClass("active");

    // B. Populate Values
    populateFilterValues(colToActivate, headerRow);

    // C. Open Pane
    $("#filter-pane").addClass("open");
  }

  // Attach event handlers
  $("#spreadsheet").on("click", ".cell-filter-icon", function (e) {
    e.stopPropagation(); // Prevent other clicks from firing

    $(this).addClass("filter-active");
    const $wrapper = $(this).closest(".cell-wrapper");
    openFilterPane($wrapper.data("col"), $wrapper.data("row"));
  });

  $("#filter-column-tabs").on("click", ".filter-tab", function () {
    // For now, assume header is always row 1. This could be made more robust.
    openFilterPane($(this).data("col"), 1);
  });

  // 3. Cancel Button: Close the pane
  $("#filter-cancel-btn").on("click", function () {
    $("#filter-pane").removeClass("open");
  });

  // 4. Save Button: Apply the filter
  $("#filter-save-btn").on("click", function () {
    // Apply filter for the ACTIVE tab
    const $activeTab = $("#filter-column-tabs .filter-tab.active");
    if ($activeTab.length === 0) return;

    const col = $activeTab.data("col");
    const allowedValues = new Set();
    $("#filter-values-list input:checked").each(function () {
      allowedValues.add($(this).val());
    });

    // Assume header is row 1
    const totalRows = 50;
    for (let r = 2; r <= totalRows; r++) {
      const cellValue = $(`.cell[data-col=${col}][data-row=${r}]`).val();
      const $rowWrappers = $(`.cell-wrapper[data-row=${r}]`);

      // This logic can be improved to handle multi-column filtering
      if (allowedValues.has(cellValue) || cellValue.trim() === "") {
        $rowWrappers.css("display", "grid");
      } else {
        $rowWrappers.css("display", "none");
      }
    }

    $("#filter-pane").removeClass("open");
  });
});
