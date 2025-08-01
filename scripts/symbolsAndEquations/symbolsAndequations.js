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

// Usage
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
const expressions = {
  "sub-super-scripts": [
    "x<sup>2</sup>",
    "y<sub>3</sub>",
    "z<sup>a</sup><sub>b</sub>",
  ],
  fraction: [
    "<sup>x</sup>/<sub>y</sub>",
    "<sup>a+b</sup>/<sub>c-d</sub>",
    "<sup>m^n</sup>/<sub>p^q</sub>",
  ],
  radicals: ["√x", "∛y", "∜z", "∜[n]{a}"],
  brackets: ["(x)", "[y]", "{z}", "< x>", "|v|"],
  summations: [
    "∑<sub>i=1</sub><sup>n</sup> i",
    "∑<sub>k=0</sub><sup>∞</sup> x<sup>k</sup>",
    "∑<sub>j=1</sub><sup>m</sup> j<sup>2</sup>",
  ],
  trigonometry: [
    "sin θ",
    "cos φ",
    "tan ψ",
    "csc α",
    "sec β",
    "cot γ",
    "sin<sup>-1</sup> x",
    "cos<sup>-1</sup> y",
    "tan<sup>-1</sup> z",
    "sinh x",
    "cosh y",
    "tanh z",
    "coth w",
    "sinh<sup>-1</sup> u",
    "cosh<sup>-1</sup> v",
    "tanh<sup>-1</sup> w",
    "coth<sup>-1</sup> t",
  ],
  integrals: [
    "∫ f(x) dx",
    "∫<sub>a</sub><sup>b</sup> g(x) dx",
    "∬ f(x, y) dxdy",
    "∮ C f(z) dz",
  ],
  logs: [
    "log<sub>2</sub> x",
    "ln x",
    "log<sub>10</sub> y",
    "min<sub>a</sub> b",
    "max<sub>a</sub> b",
    "lim<sub>n→∞</sub> (1 + 1/n)<sup>n</sup>",
  ],
};
function insertIntoEditor(content, range) {
  if (!focusedEditor) {
    console.warn("No editor is currently focused.");
    return;
  }

  const quill = focusedEditor;

  // Force focus to ensure selection works
  //   quill.focus();
  //   const range = quill.getSelection();

  // Get current cursor position

  if (range) {
    // If content has HTML tags, use dangerouslyPasteHTML
    if (/<[a-z][\s\S]*>/i.test(content)) {
      quill.clipboard.dangerouslyPasteHTML(range.index, content + " ");

      //   // Move cursor after inserted content
      //   setTimeout(() => {
      //     quill.setSelection(range.index + content.length);
      //   }, 0);
    } else {
      // Otherwise, treat it as plain text
      quill.insertText(range.index, content);
      //   quill.setSelection(range.index + content.length);
    }
  } else {
    // Fallback: append at the end
    const length = quill.getLength();
    if (/<[a-z][\s\S]*>/i.test(content)) {
      quill.clipboard.dangerouslyPasteHTML(length - 1, content);
      setTimeout(() => {
        quill.setSelection(length - 1 + content.length);
      }, 0);
    } else {
      quill.insertText(length - 1, content);
      quill.setSelection(length);
    }
  }
}
// Function to render expressions
function renderExpressions(containerId, expressionsArray) {
  const expressionGrid = document.getElementById(containerId);
  expressionGrid.innerHTML = ""; // Clear existing content

  expressionsArray.forEach((expression) => {
    const div = document.createElement("div");
    div.className = "expression";
    div.innerHTML = expression; // Use innerHTML for math symbols
    // Add click handler
    // Add click handler
    div.addEventListener("mousedown", (e) => {
      e.preventDefault(); // Stops focus shift
      if (focusedEditor) {
        savedRange = focusedEditor.getSelection();
        insertIntoEditor(expression, savedRange);
      }
    });
    expressionGrid.appendChild(div);
  });
}

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
