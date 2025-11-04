class ToggleComponent {
  constructor(buttonId, targetId) {
    this.button = document.querySelectorAll(`.${buttonId}`);
    this.target = document.getElementById(targetId);
    this.isVisible = false;
    this.button.forEach((button) => {
      button.addEventListener("click", () => this.toggle());
    });
  }

  toggle() {
    this.isVisible = !this.isVisible;
    this.target.style.display = this.isVisible ? "block" : "none";
  }
}

const toggle = new ToggleComponent("equationButton", "equations_and_symbols");

// Arrays of symbols and expressions... (NO CHANGES HERE)
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
    { latex: "x^{2}", display: "x²" },
    { latex: "x_{n}", display: "xₙ" },
    { latex: "x_{n}^{2}", display: "xₙ²" },
    { latex: "{}_{n}^{m}X", display: "ₙ™X" },
    { latex: "e^{-\\placeholder{}}", display: "e⁻ˣ" },
  ],
  fraction: [
    { latex: "\\placeholder{}/\\placeholder{}", display: "□/□" },
    { latex: "dy/dx", display: "dy/dx" },
    { latex: "\\Delta y/\\Delta x", display: "Δy/Δx" },
    { latex: "\\partial y/\\partial x", display: "∂y/∂x" },
    { latex: "\\delta y/\\delta x", display: "δy/δx" },
  ],

  radicals: [
    { latex: "\\sqrt{\\placeholder{}}", display: "√□" },
    { latex: "\\sqrt[n]{\\placeholder{}}", display: "□√□" },
    { latex: "\\sqrt[3]{\\placeholder{}}", display: "∛□" },
    { latex: "\\sqrt[4]{\\placeholder{}}", display: "∜□" },
  ],
  brackets: [
    { latex: "(\\placeholder{})", display: "(□)" },
    { latex: "[\\placeholder{}]", display: "[□]" },
    { latex: "\\{\\placeholder{}\\}", display: "{□}" },
    { latex: "|\\placeholder{}|", display: "|□|" },
    { latex: "<\\placeholder{}>", display: "<□>" },
  ],
  summations: [
    { latex: "\\sum_{\\placeholder{}}^{\\placeholder{}}", display: "∑" },
    { latex: "\\sum_{i=1}^{n}", display: "∑" },
  ],
  integrals: [
    { latex: "\\int_{\\placeholder{}}^{\\placeholder{}}", display: "∫" },
    { latex: "\\oint_{\\placeholder{}}^{\\placeholder{}}", display: "∮" },
  ],
  trigonometry: [
    { latex: "\\sin(\\placeholder{})", display: "sin□" },
    { latex: "\\cos(\\placeholder{})", display: "cos□" },
    { latex: "\\tan(\\placeholder{})", display: "tan□" },
    { latex: "\\csc(\\placeholder{})", display: "csc□" },
    { latex: "\\sec(\\placeholder{})", display: "sec□" },
    { latex: "\\cot(\\placeholder{})", display: "cot□" },
    { latex: "\\sin^{-1}(\\placeholder{})", display: "sin⁻¹□" },
    { latex: "\\cos^{-1}(\\placeholder{})", display: "cos⁻¹□" },
    { latex: "\\tan^{-1}(\\placeholder{})", display: "tan⁻¹□" },
    { latex: "\\csc^{-1}(\\placeholder{})", display: "csc⁻¹□" },
    { latex: "\\sec^{-1}(\\placeholder{})", display: "sec⁻¹□" },
    { latex: "\\cot^{-1}(\\placeholder{})", display: "cot⁻¹□" },
    { latex: "\\sinh(\\placeholder{})", display: "sinh□" },
    { latex: "\\cosh(\\placeholder{})", display: "cosh□" },
    { latex: "\\tanh(\\placeholder{})", display: "tanh□" },
    { latex: "\\coth(\\placeholder{})", display: "coth□" },
    { latex: "\\sinh^{-1}(\\placeholder{})", display: "sinh⁻¹□" },
    { latex: "\\cosh^{-1}(\\placeholder{})", display: "cosh⁻¹□" },
    { latex: "\\tanh^{-1}(\\placeholder{})", display: "tanh⁻¹□" },
    { latex: "\\coth^{-1}(\\placeholder{})", display: "coth⁻¹□" },
  ],
  logs: [
    { latex: "\\log_{\\placeholder{}}(\\placeholder{})", display: "log□" },
    { latex: "\\ln(\\placeholder{})", display: "ln" },
    { latex: "\\lim_{n\\to\\infty} \\placeholder{}", display: "lim" },
  ],
};

// --- START: NEW LOGIC FOR MATHLIVE ACTIVATION ---

// This variable will hold a reference to the currently active <math-field> element.
let activeMathField = null;

/**
 * Deactivates the currently active math field.
 * This makes it read-only (hiding the keyboard) and re-enables the Quill editor.
 */
function deactivateActiveMathField() {
  if (activeMathField) {
    // Make the math field read-only to hide its UI.
    activeMathField.readOnly = true;

    // Re-enable the main Quill editor for regular typing.
    if (window.focusedEditor) {
      window.focusedEditor.enable();
    }

    // Clear the reference.
    activeMathField = null;
  }
}

/**
 * Activates a specific math field.
 * This makes it editable (showing the keyboard) and disables the Quill editor.
 * @param {HTMLElement} mathFieldToActivate The <math-field> element to activate.
 */
function activateMathField(mathFieldToActivate) {
  // Do nothing if the element is invalid or already active.
  if (!mathFieldToActivate || mathFieldToActivate === activeMathField) return;

  // First, deactivate any other field that might be active.
  deactivateActiveMathField();

  // Set the new active field.
  activeMathField = mathFieldToActivate;

  // Make it editable, which will show the virtual keyboard.
  activeMathField.readOnly = false;

  // Disable the main Quill editor to prevent conflicting inputs.
  if (window.focusedEditor) {
    window.focusedEditor.disable();
  }

  // Focus the element to start editing.
  activeMathField.focus();
}

function insertIntoQuill(data) {
  const quill = window.focusedEditor;
  if (!quill) return;
  quill.focus();
  const range = quill.getSelection(true) || { index: quill.getLength() };

  if (data.latex) {
    quill.insertEmbed(range.index, "math-live", { latex: data.latex }, "user");
    quill.setSelection(range.index + 1, "silent");
  } else if (typeof data === "string") {
    quill.insertText(range.index, data, "user");
    quill.setSelection(range.index + data.length, "silent");
  }
}

function insertIntoEditor(data) {
  if (window.currentEditorMode === "true") {
    insertIntoQuill(data);
  } else {
    if (window.insertIntoSheetEditor) {
      window.insertIntoSheetEditor(data);
    } else {
      console.error("Sheet insertion function is not available.");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Setup tabs and symbols...
  renderSubcategory("basic-maths");
  renderExpressionSubcategory("sub-super-scripts");
  const tabButtons = document.querySelectorAll(".tab-button");
  const subcatButtons = document.querySelectorAll(".subcat-button");
  tabButtons.forEach((button) => button.addEventListener("click", toggleTab));
  subcatButtons.forEach((button) =>
    button.addEventListener("click", toggleSubcategory)
  );

  // --- START: MODIFIED GLOBAL CLICK HANDLER ---
  document.addEventListener(
    "click",
    (event) => {
      // Find the closest <math-field> element to where the user clicked.
      const clickedMathField = event.target.closest("math-field");

      if (clickedMathField) {
        // If the user clicked on a math field (or inside one), activate it.
        activateMathField(clickedMathField);
      } else {
        // If the user clicked anywhere else, deactivate the currently active field.
        deactivateActiveMathField();
      }
    },
    true
  );
  // --- END: MODIFIED GLOBAL CLICK HANDLER ---
});

// --- NO CHANGES to the functions below this line ---

function renderExpressions(containerId, expressionsArray) {
  const expressionGrid = document.getElementById(containerId);
  expressionGrid.innerHTML = "";
  if (!expressionsArray) return;

  expressionsArray.forEach((expressionObj) => {
    const div = document.createElement("div");
    div.className = "expression";
    div.textContent = expressionObj.display;

    div.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      insertIntoEditor(expressionObj);
    });
    expressionGrid.appendChild(div);
  });
}

function renderSymbols(containerId, symbolsArray) {
  const symbolGrid = document.getElementById(containerId);
  symbolGrid.innerHTML = "";
  symbolsArray.forEach((symbol) => {
    const div = document.createElement("div");
    div.className = "symbol";
    div.textContent = symbol;
    div.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      insertIntoEditor(symbol);
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
  if (targetTab === "symbols") renderSubcategory("basic-maths");
  else if (targetTab === "expressions")
    renderExpressionSubcategory("sub-super-scripts");
}

function toggleSubcategory(event) {
  const subcatButtons = document.querySelectorAll(".subcat-button");
  subcatButtons.forEach((button) => button.classList.remove("active"));
  const targetSubcat = event.target.dataset.subcat;
  event.target.classList.add("active");
  const activeTab = document.querySelector(".tab-content.active").id;
  if (activeTab === "symbols") {
    const symbolMap = {
      "basic-maths": basicMathsSymbols,
      negations: negationsSymbols,
      geometry: geometrySymbols,
    };
    renderSymbols("symbolGrid", symbolMap[targetSubcat] || basicMathsSymbols);
  } else if (activeTab === "expressions") {
    renderExpressions(
      "expressionGrid",
      expressions[targetSubcat] || expressions["sub-super-scripts"]
    );
  }
}

function renderSubcategory(subcat) {
  document
    .querySelectorAll(".subcat-button")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelector(`.subcat-button[data-subcat="${subcat}"]`)
    .classList.add("active");
  const symbolMap = {
    "basic-maths": basicMathsSymbols,
    negations: negationsSymbols,
    geometry: geometrySymbols,
  };
  renderSymbols("symbolGrid", symbolMap[subcat] || basicMathsSymbols);
}

function renderExpressionSubcategory(subcat) {
  document
    .querySelectorAll(".subcat-button")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelector(`.subcat-button[data-subcat="${subcat}"]`)
    .classList.add("active");
  renderExpressions(
    "expressionGrid",
    expressions[subcat] || expressions["sub-super-scripts"]
  );
}
