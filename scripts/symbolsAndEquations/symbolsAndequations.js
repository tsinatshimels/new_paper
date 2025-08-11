class ToggleComponent {
  constructor(buttonId, targetId) {
    this.button = document.getElementsByClassName(buttonId);
    this.target = document.getElementById(targetId);
    this.isVisible = false;
    this.button.forEach((button) => {
      button.addEventListener("click", () => this.toggle());
    });
  }

  toggle() {
    console.log(this.target);
    this.isVisible = !this.isVisible;
    this.target.style.display = this.isVisible ? "block" : "none";
  }
}

const toggle = new ToggleComponent("equationButton", "equations_and_symbols");

// Arrays of symbols for each subcategory
const basicMathsSymbols = [
  "±",
  "∞",
  "≠",
  "#",
  "~",
  "×",
  "÷",
  "!",
  "α",
  "<",
  "≪",
  ">",
  ">>",
  "≤",
  "≥",
  "≠",
  "=",
  "∀",
  "∁",
  "∂",
  "∮",
  "∇",
  "√",
  "∝",
  "∪",
  "∩",
  "∅",
  "%",
  "°",
  "°F",
  "°C",
  "Δ",
  "∀",
  "∃",
  "∈",
  "∉",
  "←",
  "↑",
  "→",
  "↓",
  "↔",
  "↕",
  "…",
  "+",
  "−",
  "÷",
  "×",
  "a",
  "β",
  "γ",
  "δ",
  "ε",
  "θ",
  "λ",
  "μ",
  "π",
  "ρ",
  "σ",
  "τ",
  "φ",
  "ψ",
  "*",
  ".",
  ":",
  "∴",
  "∵",
  "∧",
  "∨",
  "⊥",
  "⊤",
  "⊢",
  "⊣",
];
const negationsSymbols = [
  "≠",
  "⋠",
  "⋡",
  "⋢",
  "⋣",
  "≢",
  "≁",
  "≇",
  "≄",
  "≄",
  "≁",
  "≂̸",
  "≉",
  "≭",
  "≭",
  "≏",
  "≓̸",
  "≖̸",
  "⊄",
  "⊅",
  "⊈",
  "⊉",
  "⊬",
  "⊭",
  "⊯",
  "⊰",
  "⊱",
  "⋪",
  "⋫",
  "⋬",
  "⋭",
  "⊶̸",
  "⊷̸",
  "⋋̸",
  "⋌̸",
  "⋍̸",
  "⇍",
  "⇎",
  "⇏",
  "⇎",
  "⇚",
  "⇛̸",
];

const geometrySymbols = [
  "⌞",
  "∡",
  "⦤",
  "⦣",
  "⌟",
  "⟀",
  "⧫",
  "⊥",
  "⫽",
  "⫻",
  "∥",
  "⫼",
  "∶",
  "∷",
  "∴",
  "∵",
  "▮",
];

const expressions = {
  "sub-super-scripts": [
    {
      type: "blot",
      content: { layout: "diagonal-lr" },
      display:
        '<div class="math-layout diagonal"><span class="editable-box bottom-left"></span><span class="editable-box top-right"></span></div>',
    },
    {
      type: "blot",
      content: { layout: "diagonal-rl" },
      display:
        '<div class="math-layout diagonal"><span class="editable-box top-left"></span><span class="editable-box bottom-right"></span></div>',
    },
    {
      type: "blot",
      content: { layout: "vertical-right" },
      display:
        '<div class="math-layout dual"><span class="editable-box top-middle-left"></span><div class="vertical-right"><span class="editable-box sup"></span><span class="editable-box sub"></span></div></div>',
    },
    {
      type: "blot",
      content: { layout: "vertical-left" },
      display:
        '<div class="math-layout dual"><span class="editable-box top-middle-right"></span><div class="vertical-left"><span class="editable-box sup"></span><span class="editable-box sub"></span></div></div>',
    },
    {
      type: "blot",
      content: { layout: "e-power-neg-x" },
      display: '<div class="math-layout"><span>e<sup>-x</sup></span></div>',
    },
    {
      type: "blot",
      content: { layout: "x-squared" },
      display: '<div class="math-layout"><span>x<sup>2</sup></span></div>',
    },
    {
      type: "blot",
      content: { layout: "n-sub-1-y" },
      display: '<div class="math-layout"><span>n<sub>1</sub>Y</span></div>',
    },
  ],
  fraction: [
    { type: "html", content: "<sup>x</sup>/<sub>y</sub>" },
    { type: "html", content: "<sup>a+b</sup>/<sub>c-d</sub>" },
    { type: "html", content: "<sup>m^n</sup>/<sub>p^q</sub>" },
  ],
  fraction: [
    {
      type: "html",
      content: "<sup>x</sup>/<sub>y</sub>",
      display: "<sup>x</sup>/<sub>y</sub>",
    },
    {
      type: "html",
      content: "<sup>a+b</sup>/<sub>c-d</sub>",
      display: "<sup>a+b</sup>/<sub>c-d</sub>",
    },
    {
      type: "html",
      content: "<sup>m^n</sup>/<sub>p^q</sub>",
      display: "<sup>m^n</sup>/<sub>p^q</sub>",
    },
  ],
  radicals: [
    { type: "html", content: "√x", display: "√x" },
    { type: "html", content: "∛y", display: "∛y" },
    { type: "html", content: "∜z", display: "∜z" },
    { type: "html", content: "∜[n]{a}", display: "∜[n]{a}" },
  ],
  brackets: [
    { type: "html", content: "(x)", display: "(x)" },
    { type: "html", content: "[y]", display: "[y]" },
    { type: "html", content: "{z}", display: "{z}" },
    { type: "html", content: "<x>", display: "<x>" }, // Use HTML entity for <
    { type: "html", content: "|v|", display: "|v|" },
  ],
  summations: [
    {
      type: "html",
      content: "∑<sub>i=1</sub><sup>n</sup> i",
      display: "∑<sub>i=1</sub><sup>n</sup> i",
    },
    {
      type: "html",
      content: "∑<sub>k=0</sub><sup>∞</sup> x<sup>k</sup>",
      display: "∑<sub>k=0</sub><sup>∞</sup> x<sup>k</sup>",
    },
    {
      type: "html",
      content: "∑<sub>j=1</sub><sup>m</sup> j<sup>2</sup>",
      display: "∑<sub>j=1</sub><sup>m</sup> j<sup>2</sup>",
    },
  ],
  trigonometry: [
    { type: "html", content: "sin θ", display: "sin θ" },
    { type: "html", content: "cos φ", display: "cos φ" },
    { type: "html", content: "tan ψ", display: "tan ψ" },
    {
      type: "html",
      content: "sin<sup>-1</sup> x",
      display: "sin<sup>-1</sup> x",
    },
    {
      type: "html",
      content: "cos<sup>-1</sup> y",
      display: "cos<sup>-1</sup> y",
    },
    {
      type: "html",
      content: "tan<sup>-1</sup> z",
      display: "tan<sup>-1</sup> z",
    },
  ],
  integrals: [
    { type: "html", content: "∫ f(x) dx", display: "∫ f(x) dx" },
    {
      type: "html",
      content: "∫<sub>a</sub><sup>b</sup> g(x) dx",
      display: "∫<sub>a</sub><sup>b</sup> g(x) dx",
    },
    { type: "html", content: "∬ f(x, y) dxdy", display: "∬ f(x, y) dxdy" },
    { type: "html", content: "∮ C f(z) dz", display: "∮ C f(z) dz" },
  ],
  logs: [
    {
      type: "html",
      content: "log<sub>2</sub> x",
      display: "log<sub>2</sub> x",
    },
    { type: "html", content: "ln x", display: "ln x" },
    {
      type: "html",
      content: "lim<sub>n→∞</sub> (1 + 1/n)<sup>n</sup>",
      display: "lim<sub>n→∞</sub> (1 + 1/n)<sup>n</sup>",
    },
  ],
};

let activeMathLayout = null; // Keep track of the currently active math-layout element

function insertIntoEditor(data, range) {
  const quill = window.focusedEditor;
  if (!quill) {
    console.warn("No editor is currently focused.");
    return;
  }

  if (!range) {
    range = quill.getSelection(true);
  }

  // Check if the data is a plain string (from the symbols tab)
  if (typeof data === "string") {
    quill.insertText(range.index, data, Quill.sources.USER);
    quill.setSelection(range.index + data.length, Quill.sources.SILENT);
    return;
  }

  // Otherwise, it's an object from the expressions tab
  switch (data.type) {
    case "blot":
      quill.insertEmbed(
        range.index,
        "sub-super-script",
        data.content,
        Quill.sources.USER
      );
      quill.setSelection(range.index + 1, Quill.sources.SILENT);

      // Use setTimeout to ensure DOM is updated and Quill has finished its rendering
      setTimeout(() => {
        const insertedBlot = quill.container.querySelector(
          ".ql-editor .math-layout:not(.ql-blank)"
        ); // Select the math-layout that was just inserted
        if (insertedBlot) {
          activateMathLayout(insertedBlot);

          // Add double-click handler
          insertedBlot.addEventListener("dblclick", (event) => {
            event.preventDefault();
            event.stopPropagation(); // Prevent the document click listener from firing immediately
            activateMathLayout(insertedBlot);
          });
        }
      }, 0);
      break;

    case "html":
      // Check for active math layout
      if (activeMathLayout) {
        // Insert HTML into the active math layout
        activeMathLayout.insertAdjacentHTML("beforeend", data.content + " "); // Or 'afterbegin', depending on desired insertion point
      } else {
        // Create a new math layout and insert HTML
        const insertIndex = range.index;
        quill.insertText(insertIndex, " ", Quill.sources.USER); // Insert a space first
        quill.clipboard.dangerouslyPasteHTML(
          insertIndex,
          `<div class="math-layout">${data.content}</div> `, //Wrap with math-layout
          Quill.sources.USER
        );

        //Activate the new math layout
        setTimeout(() => {
          const insertedBlot = quill.container.querySelector(
            ".ql-editor .math-layout:not(.ql-blank)"
          ); // Select the math-layout that was just inserted
          if (insertedBlot) {
            activateMathLayout(insertedBlot);

            // Add double-click handler
            insertedBlot.addEventListener("dblclick", (event) => {
              event.preventDefault();
              event.stopPropagation(); // Prevent the document click listener from firing immediately
              activateMathLayout(insertedBlot);
            });
          }
        }, 0);
      }
      break;

    case "text":
      quill.insertText(range.index, data.content, Quill.sources.USER);
      quill.setSelection(
        range.index + data.content.length,
        Quill.sources.SILENT
      );
      break;
  }
}

function renderExpressions(containerId, expressionsArray) {
  const expressionGrid = document.getElementById(containerId);
  expressionGrid.innerHTML = ""; // Clear existing content

  expressionsArray.forEach((expressionObj) => {
    const div = document.createElement("div");
    div.className = "expression";
    div.innerHTML = expressionObj.display;

    div.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (window.focusedEditor) {
        savedRange = window.focusedEditor.getSelection();
        insertIntoEditor(expressionObj, savedRange);
      }
    });
    expressionGrid.appendChild(div);
  });
}

function renderSymbols(containerId, symbolsArray) {
  const symbolGrid = document.getElementById(containerId);
  symbolGrid.innerHTML = ""; // Clear existing content

  symbolsArray.forEach((symbol) => {
    const div = document.createElement("div");
    div.className = "symbol";
    div.textContent = symbol;

    div.addEventListener("mousedown", (e) => {
      e.preventDefault(); // Stops focus shift
      if (focusedEditor) {
        savedRange = focusedEditor.getSelection();
        insertIntoEditor(symbol, savedRange);
      }
    });
    symbolGrid.appendChild(div);
  });
}

function toggleTab(event) {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => button.classList.remove("active"));
  tabContents.forEach((content) => content.classList.remove("active"));

  const targetTab = event.target.dataset.tab;

  event.target.classList.add("active");
  document.getElementById(targetTab).classList.add("active");

  if (targetTab === "symbols") {
    renderSubcategory("basic-maths"); // Default to Basic Maths
  } else if (targetTab === "expressions") {
    renderExpressionSubcategory("sub-super-scripts"); // Default to Sub/Super Scripts
  }
}

function toggleSubcategory(event) {
  const subcatButtons = document.querySelectorAll(".subcat-button");

  subcatButtons.forEach((button) => button.classList.remove("active"));

  const targetSubcat = event.target.dataset.subcat;
  event.target.classList.add("active");

  const activeTab = document.querySelector(".tab-content.active").id;

  if (activeTab === "symbols") {
    switch (targetSubcat) {
      case "basic-maths":
        renderSymbols("symbolGrid", basicMathsSymbols);
        break;
      case "negations":
        renderSymbols("symbolGrid", negationsSymbols);
        break;
      case "geometry":
        renderSymbols("symbolGrid", geometrySymbols);
        break;
      default:
        renderSymbols("symbolGrid", basicMathsSymbols);
    }
  } else if (activeTab === "expressions") {
    renderExpressions("expressionGrid", expressions[targetSubcat]);
  }
}

function renderSubcategory(subcat) {
  const subcatButtons = document.querySelectorAll(".subcat-button");
  const symbolGrid = document.getElementById("symbolGrid");

  subcatButtons.forEach((button) => button.classList.remove("active"));
  document.querySelector(`[data-subcat="${subcat}"]`).classList.add("active");

  switch (subcat) {
    case "basic-maths":
      renderSymbols("symbolGrid", basicMathsSymbols);
      break;
    case "negations":
      renderSymbols("symbolGrid", negationsSymbols);
      break;
    case "geometry":
      renderSymbols("symbolGrid", geometrySymbols);
      break;
    default:
      renderSymbols("symbolGrid", basicMathsSymbols);
  }
}

function renderExpressionSubcategory(subcat) {
  const subcatButtons = document.querySelectorAll(".subcat-button");
  const expressionGrid = document.getElementById("expressionGrid");

  subcatButtons.forEach((button) => button.classList.remove("active"));
  document.querySelector(`[data-subcat="${subcat}"]`).classList.add("active");

  renderExpressions("expressionGrid", expressions[subcat]);
}

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const subcatButtons = document.querySelectorAll(".subcat-button");

  tabButtons.forEach((button) => button.addEventListener("click", toggleTab));
  subcatButtons.forEach((button) =>
    button.addEventListener("click", toggleSubcategory)
  );

  renderSubcategory("basic-maths"); // For Symbols
  renderExpressionSubcategory("sub-super-scripts"); // For Expressions

  // Add a global click listener to deactivate the math layout
  document.addEventListener("mousedown", (event) => {
    if (activeMathLayout && !activeMathLayout.contains(event.target)) {
      deactivateMathLayout(activeMathLayout);
      activeMathLayout = null;
    }
  });
});

let savedRange = null; // Keep track of the saved range

function activateMathLayout(element) {
  if (!element) return;

  // Deactivate any previously active element
  if (activeMathLayout && activeMathLayout !== element) {
    deactivateMathLayout(activeMathLayout);
  }

  activeMathLayout = element; // Set the currently active element

  element.classList.add("active"); // Add the 'active' class to show the border/icons
  addControls(element); // Add controls here

  makeEditable(element); // Make the editable boxes editable

  // Save the current selection range before activating
  savedRange = window.focusedEditor.getSelection();
}

function deactivateMathLayout(element) {
  if (!element) return;

  element.classList.remove("active"); // Remove the 'active' class to hide the border/icons
  removeControls(element);

  // Remove contenteditable from the editable boxes
  const editableBoxes = element.querySelectorAll(".editable-box");
  editableBoxes.forEach((box) => {
    box.removeAttribute("contenteditable");
  });
}
function removeControls(element) {
  const controls = element.querySelector(".controls");
  if (controls) {
    controls.remove();
  }
}
function makeEditable(element) {
  const editableBoxes = element.querySelectorAll(".editable-box");
  editableBoxes.forEach((box) => {
    box.contentEditable = "true";

    box.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default line break in contenteditable

        const quill = window.focusedEditor;
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertText(range.index + 1, "\n", Quill.sources.USER); // Insert a newline character
          quill.setSelection(range.index + 2, Quill.sources.SILENT); // Move the cursor after the newline
        }
        deactivateMathLayout(element); // Deactivate after pressing enter.
      }
    });
    box.focus();
  });

  // Focus the first editable box, or the element itself if no boxes exist
  if (editableBoxes.length > 0) {
    editableBoxes.forEach((box) => box.focus());
  } else {
    element.focus();
  }
}

function enableRuler(element) {
  const resizer = element.querySelector(".resizer");
  if (!resizer) return;

  resizer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    console.log("Ruler Interaction");

    function drag(event) {
      element.style.transform = `translate(${event.clientX - e.clientX}px, ${
        event.clientY - e.clientY
      }px)`;
    }

    window.addEventListener("mousemove", drag);
    window.addEventListener(
      "mouseup",
      () => {
        window.removeEventListener("mousemove", drag);
      },
      { once: true }
    );
  });
}

// function addDropdown(element) {
//   const dropdownTrigger = element.querySelector(".dropdown-trigger");
//   if (!dropdownTrigger) return;

//   const dropdownMenu = document.createElement("div");
//   dropdownMenu.className = "dropdown-menu-paper";
//   dropdownMenu.innerHTML = `
//         <div class="dropdown-section">
//             <div class="dropdown-title">Formats</div>
//             <button data-format="inline">Inline Text</button>
//             <button data-format="math">Math Display</button>
//             <button data-format="inline-all">Inline Text (All)</button>
//             <button data-format="math-all">Math Display (All)</button>
//         </div>

//         `; // Replace with your actual menu items
//   // <div class="dropdown-section">
//   //     <div class="dropdown-title">Justification</div>
//   //     <button data-justify="left">Left</button>
//   //     <button data-justify="right">Right</button>
//   //     <button data-justify="center">Centered</button>
//   //     <button data-justify="center-group">Centered as a Group</button>
//   // </div>
//   element.appendChild(dropdownMenu);

//   dropdownTrigger.addEventListener("click", (e) => {
//     e.stopPropagation();
//     dropdownMenu.classList.toggle("show");
//   });

//   // Close the dropdown if clicked outside
//   document.addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//   });

//   // Add event listeners for the dropdown options
//   dropdownMenu.querySelectorAll("button").forEach((button) => {
//     button.addEventListener("click", (e) => {
//       e.stopPropagation(); // Prevent the document click listener from firing immediately
//       const format = button.dataset.format;
//       const justify = button.dataset.justify;

//       if (format) {
//         // Handle format options (e.g., apply Quill formatting)
//         console.log(`Applying format: ${format}`);
//       }

//       if (justify) {
//         // Handle justification options (e.g., apply CSS styles)
//         console.log(`Applying justification: ${justify}`);
//       }

//       dropdownMenu.classList.remove("show"); // Close the dropdown
//     });
//   });
// }

function addDropdown(element) {
  const dropdownTrigger = element.querySelector(".dropdown-trigger");
  if (!dropdownTrigger) return;

  // Clone template instead of creating HTML
  const template = document.getElementById("dropdown-template");
  if (!template) return;

  const dropdownMenu = template.content.cloneNode(true).firstElementChild;
  element.appendChild(dropdownMenu);

  // Toggle dropdown visibility
  dropdownTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
  });

  // Close when clicking outside
  document.addEventListener("click", () =>
    dropdownMenu.classList.remove("show")
  );

  // Handle button clicks
  dropdownMenu.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const format = button.dataset.format;
      if (format) console.log(`Applying format: ${format}`);
      dropdownMenu.classList.remove("show");
    });
  });
  const justifySubmenu = document.getElementById("justifySubmenu");
  justifySubmenu.addEventListener("click", (e) => {
    e.stopPropagation();
    const submenus = document.querySelector(".justify-submenu");
    submenus.classList.toggle("show");
    justifySubmenu.classList.toggle("active-sort-button");
    console.log("Justification submenu toggled");
  });
}

function addControls(element) {
  const controls = document.createElement("div");
  controls.className = "controls";
  controls.innerHTML = `<span class="resizer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.5 12h-19m15.833 3.167L21.5 12l-3.167-3.167M5.667 15.167L2.5 12l3.167-3.167m3.166 9.5L12 21.5l3.167-3.167M8.833 5.667L12 2.5l3.167 3.167M12 21.5v-19"/></svg></span><span class="dropdown-trigger"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="none"/><path fill="#fff" d="m9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828L5.757 6.586L4.343 8z"/></svg></span>`;
  element.appendChild(controls);

  enableRuler(element);
  addDropdown(element);
}
