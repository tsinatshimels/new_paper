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

// --- SIMPLIFIED STATE MANAGEMENT ---

const expressions = {
  "sub-super-scripts": [
    { latex: "x^{2}", display: "x²" },
    { latex: "x_{n}", display: "xₙ" },
    { latex: "x_{n}^{2}", display: "xₙ²" },
    { latex: "{}_{n}^{m}X", display: "ₙ™X" },
    { latex: "e^{-\\placeholder{}}", display: "e⁻ˣ" },
  ],
  fraction: [
    { latex: "\\frac{\\placeholder{}}{\\placeholder{}}", display: "□/□" },
    // dy/dx
    { latex: "\\frac{dy}{dx}", display: "dy/dx" },
    // Δx/Δy
    { latex: "\\frac{\\Delta y}{\\Delta x}", display: "Δy/Δx" },
    // ∂y/∂x
    { latex: "\\frac{\\partial y}{\\partial x}", display: "∂y/∂x" },
    // δy/δx
    { latex: "\\frac{\\delta y}{\\delta x}", display: "δy/δx" },
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
    // csc
    { latex: "\\csc(\\placeholder{})", display: "csc□" },
    { latex: "\\sec(\\placeholder{})", display: "sec□" },
    { latex: "\\cot(\\placeholder{})", display: "cot□" },
    { latex: "\\sin^{-1}(\\placeholder{})", display: "sin⁻¹□" },
    { latex: "\\cos^{-1}(\\placeholder{})", display: "cos⁻¹□" },
    { latex: "\\tan^{-1}(\\placeholder{})", display: "tan⁻¹□" },
    // csc⁻¹
    { latex: "\\csc^{-1}(\\placeholder{})", display: "csc⁻¹□" },
    { latex: "\\sec^{-1}(\\placeholder{})", display: "sec⁻¹□" },
    { latex: "\\cot^{-1}(\\placeholder{})", display: "cot⁻¹□" },
    // sinh
    { latex: "\\sinh(\\placeholder{})", display: "sinh□" },
    { latex: "\\cosh(\\placeholder{})", display: "cosh□" },
    { latex: "\\tanh(\\placeholder{})", display: "tanh□" },
    // coth
    { latex: "\\coth(\\placeholder{})", display: "coth□" },
    // sinh⁻¹
    { latex: "\\sinh^{-1}(\\placeholder{})", display: "sinh⁻¹□" },
    { latex: "\\cosh^{-1}(\\placeholder{})", display: "cosh⁻¹□" },
    { latex: "\\tanh^{-1}(\\placeholder{})", display: "tanh⁻¹□" },
    // coth⁻¹
    { latex: "\\coth^{-1}(\\placeholder{})", display: "coth⁻¹□" },
  ],
  logs: [
    { latex: "\\log_{\\placeholder{}}(\\placeholder{})", display: "log□" },
    { latex: "\\ln(\\placeholder{})", display: "ln" },
    { latex: "\\lim_{n\\to\\infty} \\placeholder{}", display: "lim" },
  ],
};

let activeBlotElement = null;

function deactivateActiveBlot() {
  if (!activeBlotElement) return;
  const elementToDeactivate = activeBlotElement;
  activeBlotElement = null;
  elementToDeactivate.classList.remove("active");
  removeControls(elementToDeactivate); // Hides the purple controller
}

function activateBlot(elementToActivate) {
  if (!elementToActivate || elementToActivate === activeBlotElement) return;
  deactivateActiveBlot(); // Deactivate any other blot first.
  activeBlotElement = elementToActivate;
  activeBlotElement.classList.add("active");
  addControls(activeBlotElement); // Shows the purple controller
}

// This is now incredibly simple.
function insertIntoEditor(data) {
  const quill = window.focusedEditor;
  if (!quill) return;
  quill.focus();
  const range = quill.getSelection(true) || { index: quill.getLength() };

  // Check if we are inserting a math expression
  if (data.latex) {
    // Insert the blot with the LaTeX payload
    quill.insertEmbed(range.index, "math-live", { latex: data.latex }, "user");
    quill.setSelection(range.index + 1, "silent");
  }
  // Handle plain symbols
  else if (typeof data === "string") {
    quill.insertText(range.index, data, "user");
    quill.setSelection(range.index + data.length, "silent");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Setup tabs and symbols...
  renderSubcategory("basic-maths");
  renderExpressionSubcategory("sub-super-scripts"); // Default to showing first category
  const tabButtons = document.querySelectorAll(".tab-button");
  const subcatButtons = document.querySelectorAll(".subcat-button");
  tabButtons.forEach((button) => button.addEventListener("click", toggleTab));
  subcatButtons.forEach((button) =>
    button.addEventListener("click", toggleSubcategory)
  );

  // The single, global click handler for activation/deactivation
  document.addEventListener(
    "click",
    (event) => {
      const clickedBlot = event.target.closest(".mathlive-blot-wrapper");

      // If a blot was clicked, activate it.
      if (clickedBlot) {
        activateBlot(clickedBlot);
      }
      // If the click was anywhere else, deactivate the current blot.
      else if (activeBlotElement) {
        deactivateActiveBlot();
      }
    },
    true
  );
});

// --- RENDERING & UI FUNCTIONS (small change to renderExpressions) ---
function renderExpressions(containerId, expressionsArray) {
  const expressionGrid = document.getElementById(containerId);
  expressionGrid.innerHTML = "";
  if (!expressionsArray) return;

  expressionsArray.forEach((expressionObj) => {
    const div = document.createElement("div");
    div.className = "expression"; // Keep your styling
    // Use the simple `display` text for the button
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
  /* ... */
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
  /* ... */
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
  /* ... */
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
  /* ... */
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
  /* ... */
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

// --- NO CHANGES to control-adding functions ---
function addControls(element) {
  /* ... */
  if (element.querySelector(".controls")) return;
  const controls = document.createElement("div");
  controls.className = "controls";
  controls.innerHTML = `<span class="resizer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.5 12h-19m15.833 3.167L21.5 12l-3.167-3.167M5.667 15.167L2.5 12l3.167-3.167m3.166 9.5L12 21.5l3.167-3.167M8.833 5.667L12 2.5l3.167 3.167M12 21.5v-19"/></svg></span><span class="dropdown-trigger"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="none"/><path fill="#fff" d="m9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828L5.757 6.586L4.343 8z"/></svg></span>`;
  element.appendChild(controls);
  enableRuler(element);
  addDropdown(element);
}
function removeControls(element) {
  /* ... */
  const controls = element.querySelector(".controls");
  if (controls) {
    controls.remove();
  }
}
function enableRuler(element) {
  /* ... */
  const resizer = element.querySelector(".resizer");
  if (!resizer) return;
  resizer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    function drag(event) {
      element.style.transform = `translate(${event.clientX - e.clientX}px, ${
        event.clientY - e.clientY
      }px)`;
    }
    window.addEventListener("mousemove", drag);
    window.addEventListener(
      "mouseup",
      () => window.removeEventListener("mousemove", drag),
      { once: true }
    );
  });
}
function addDropdown(element) {
  /* ... */
  const dropdownTrigger = element.querySelector(".dropdown-trigger");
  if (!dropdownTrigger) return;
  const template = document.getElementById("dropdown-template");
  if (!template) return;
  const dropdownMenu = template.content.cloneNode(true).firstElementChild;
  element.appendChild(dropdownMenu);
  dropdownTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
  });
  document.addEventListener("click", () =>
    dropdownMenu.classList.remove("show")
  );
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
