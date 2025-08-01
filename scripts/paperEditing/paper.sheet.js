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
  for (let r = rowStart; r !== rowEnd + rowStep; r += rowStep) {
    for (let c = colStart; c !== colEnd + colStep; c += colStep) {
      const $cell = $(`<input type='text' class="cell" />`)
        .css("--cell-col", c)
        .css("--cell-row", r)
        .attr("data-col", c)
        .attr("data-row", r);
      $cellsWrapper.append($cell);
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
