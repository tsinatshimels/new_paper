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

// Arrays for Expressions subcategories
// const expressions = {
//   "sub-super-scripts": [
//     // Sub-left + Sup-right (NOTE: contenteditable="true" is removed)
//     `<div class="math-layout diagonal">
//       <span class="editable-box bottom-left"></span>
//       <span class="editable-box top-right"></span>
//     </div>`,

//     // Sup-left + Sub-right
//     `<div class="math-layout diagonal">
//       <span class="editable-box top-left"></span>
//       <span class="editable-box bottom-right"></span>
//     </div>`,

//     // Sub + Sup stacked vertically (right side)
//     `<div class="math-layout dual">
//       <span class="editable-box top-middle-left"></span>
//       <div class="vertical-right">
//         <span class="editable-box sup"></span>
//         <span class="editable-box sub"></span>
//       </div>
//     </div>`,

//     // Sub + Sup stacked vertically (left side)
//     `<div class="math-layout dual">
//       <span class="editable-box top-middle-right"></span>
//       <div class="vertical-left">
//         <span class="editable-box sup"></span>
//         <span class="editable-box sub"></span>
//       </div>
//     </div>`,

//     // e^(-x)
//     `<div class="math-layout">
//       <span>e<sup><span class="editable-inline">-x</span></sup></span>
//     </div>`,

//     // x²
//     `<div class="math-layout">
//       <span>x<sup><span class="editable-inline">2</span></sup></span>
//     </div>`,

//     // n₁Y
//     `<div class="math-layout">
//       <span>n<sub><span class="editable-inline">1</span></sub>Y</span>
//     </div>`,
//   ],
//   // "sub-super-scripts": [
//   //   // Sub-left + Sup-right
//   //   "a_{\\Box}^{\\Box}",

//   //   // Sup-left + Sub-right — flipped version
//   //   "^{\\Box}_{\\Box}a",

//   //   // Sub + Sup stacked vertically (right side)
//   //   "x^{\\Box}_{\\Box}",

//   //   // Sub + Sup stacked vertically (left side)
//   //   "^{\\Box}_{\\Box}x",

//   //   // e^(-x)
//   //   "e^{-x}",

//   //   // x²
//   //   "x^2",

//   //   // n₁Y
//   //   "n_1Y",
//   // ],
//   fraction: [
//     "<sup>x</sup>/<sub>y</sub>",
//     "<sup>a+b</sup>/<sub>c-d</sub>",
//     "<sup>m^n</sup>/<sub>p^q</sub>",
//   ],
//   radicals: ["√x", "∛y", "∜z", "∜[n]{a}"],
//   brackets: ["(x)", "[y]", "{z}", "< x>", "|v|"],
//   summations: [
//     "∑<sub>i=1</sub><sup>n</sup> i",
//     "∑<sub>k=0</sub><sup>∞</sup> x<sup>k</sup>",
//     "∑<sub>j=1</sub><sup>m</sup> j<sup>2</sup>",
//   ],
//   trigonometry: [
//     "sin θ",
//     "cos φ",
//     "tan ψ",
//     "csc α",
//     "sec β",
//     "cot γ",
//     "sin<sup>-1</sup> x",
//     "cos<sup>-1</sup> y",
//     "tan<sup>-1</sup> z",
//     "sinh x",
//     "cosh y",
//     "tanh z",
//     "coth w",
//     "sinh<sup>-1</sup> u",
//     "cosh<sup>-1</sup> v",
//     "tanh<sup>-1</sup> w",
//     "coth<sup>-1</sup> t",
//   ],
//   integrals: [
//     "∫ f(x) dx",
//     "∫<sub>a</sub><sup>b</sup> g(x) dx",
//     "∬ f(x, y) dxdy",
//     "∮ C f(z) dz",
//   ],
//   logs: [
//     "log<sub>2</sub> x",
//     "ln x",
//     "log<sub>10</sub> y",
//     "min<sub>a</sub> b",
//     "max<sub>a</sub> b",
//     "lim<sub>n→∞</sub> (1 + 1/n)<sup>n</sup>",
//   ],
// };
const expressions = {
  // This is our special category that uses the custom Blot
  "sub-super-scripts": [
    // We now pass a descriptive object instead of an HTML string
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
  // These categories use simple HTML pasting
  fraction: [
    { type: "html", content: "<sup>x</sup>/<sub>y</sub>" },
    { type: "html", content: "<sup>a+b</sup>/<sub>c-d</sub>" },
    { type: "html", content: "<sup>m^n</sup>/<sub>p^q</sub>" },
  ],
  radicals: [
    { type: "html", content: "√x" },
    { type: "html", content: "∛y" },
    { type: "html", content: "∜z" },
    { type: "html", content: "∜[n]{a}" },
  ],
  brackets: [
    { type: "html", content: "(x)" },
    { type: "html", content: "[y]" },
    { type: "html", content: "{z}" },
    { type: "html", content: "<x>" }, // Use HTML entity for <
    { type: "html", content: "|v|" },
  ],
  summations: [
    { type: "html", content: "∑<sub>i=1</sub><sup>n</sup> i" },
    { type: "html", content: "∑<sub>k=0</sub><sup>∞</sup> x<sup>k</sup>" },
    { type: "html", content: "∑<sub>j=1</sub><sup>m</sup> j<sup>2</sup>" },
  ],
  trigonometry: [
    { type: "html", content: "sin θ" },
    { type: "html", content: "cos φ" },
    { type: "html", content: "tan ψ" },
    { type: "html", content: "sin<sup>-1</sup> x" },
    { type: "html", content: "cos<sup>-1</sup> y" },
    { type: "html", content: "tan<sup>-1</sup> z" },
  ],
  integrals: [
    { type: "html", content: "∫ f(x) dx" },
    { type: "html", content: "∫<sub>a</sub><sup>b</sup> g(x) dx" },
    { type: "html", content: "∬ f(x, y) dxdy" },
    { type: "html", content: "∮ C f(z) dz" },
  ],
  logs: [
    { type: "html", content: "log<sub>2</sub> x" },
    { type: "html", content: "ln x" },
    { type: "html", content: "lim<sub>n→∞</sub> (1 + 1/n)<sup>n</sup>" },
  ],
};
// Replace your insertIntoEditor function with this smart version
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
  // Use a switch statement to handle each type
  switch (data.type) {
    case "blot":
      // Pass the CONTENT OBJECT to the blot
      quill.insertEmbed(
        range.index,
        "sub-super-script",
        data.content,
        Quill.sources.USER
      );
      quill.setSelection(range.index + 1, Quill.sources.SILENT);
      break;

    case "html":
      // Use dangerouslyPasteHTML for all other simple HTML content
      quill.clipboard.dangerouslyPasteHTML(
        range.index,
        data.content + " ",
        Quill.sources.USER
      );
      break;

    case "text":
      // Fallback for any expressions defined as plain text
      quill.insertText(range.index, data.content, Quill.sources.USER);
      quill.setSelection(
        range.index + data.content.length,
        Quill.sources.SILENT
      );
      break;
  }
}
// Function to render expressions
// Replace your renderExpressions function with this

function renderExpressions(containerId, expressionsArray) {
  const expressionGrid = document.getElementById(containerId);
  expressionGrid.innerHTML = ""; // Clear existing content

  expressionsArray.forEach((expressionObj) => {
    const div = document.createElement("div");
    div.className = "expression";
    // Use the NEW 'display' property for the preview HTML
    div.innerHTML = expressionObj.display;

    div.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (window.focusedEditor) {
        savedRange = window.focusedEditor.getSelection();
        // Pass the ENTIRE OBJECT to the insert function
        insertIntoEditor(expressionObj, savedRange);
      }
    });
    expressionGrid.appendChild(div);
  });
}

// function renderExpressions(containerId, expressionsArray) {
//   const expressionGrid = document.getElementById(containerId);
//   expressionGrid.innerHTML = ""; // Clear existing content

//   expressionsArray.forEach((latex) => {
//     const div = document.createElement("div");
//     div.className = "expression";

//     const preview = MQ.StaticMath(document.createElement("span"));
//     preview.latex(latex);
//     div.appendChild(preview.el());

//     // Insert handler
//     div.addEventListener("mousedown", (e) => {
//       e.preventDefault();
//       const editor = window.focusedEditor;
//       if (!editor) return;

//       savedRange = editor.getSelection();

//       if (savedRange) {
//         const mathEl = createMathFieldElement(latex);
//         editor.insertEmbed(savedRange.index, "mathquill", latex);

//         editor.setSelection(savedRange.index + 1);
//       }
//     });

//     expressionGrid.appendChild(div);
//   });
// }

let savedRange = null;

// Function to render symbols
function renderSymbols(containerId, symbolsArray) {
  const symbolGrid = document.getElementById(containerId);
  symbolGrid.innerHTML = ""; // Clear existing content

  symbolsArray.forEach((symbol) => {
    const div = document.createElement("div");
    div.className = "symbol";
    div.textContent = symbol;

    // Add click handler
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

// Function to toggle main tabs
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

// Function to toggle subcategory tabs
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

// Helper function to render the default subcategory for Symbols
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

// Helper function to render the default subcategory for Expressions
function renderExpressionSubcategory(subcat) {
  const subcatButtons = document.querySelectorAll(".subcat-button");
  const expressionGrid = document.getElementById("expressionGrid");

  subcatButtons.forEach((button) => button.classList.remove("active"));
  document.querySelector(`[data-subcat="${subcat}"]`).classList.add("active");

  renderExpressions("expressionGrid", expressions[subcat]);
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const subcatButtons = document.querySelectorAll(".subcat-button");

  tabButtons.forEach((button) => button.addEventListener("click", toggleTab));
  subcatButtons.forEach((button) =>
    button.addEventListener("click", toggleSubcategory)
  );

  // Initial render for the active tab (Symbols)
  renderSubcategory("basic-maths"); // For Symbols
  renderExpressionSubcategory("sub-super-scripts"); // For Expressions
});
