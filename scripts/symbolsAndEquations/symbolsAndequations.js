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
      blotName: "sub-super-script",
      content: { layout: "diagonal-lr" },
      display:
        '<div class="math-layout diagonal"><span class="editable-box bottom-left"></span><span class="editable-box top-right"></span></div>',
    },
    {
      type: "blot",
      blotName: "sub-super-script",
      content: { layout: "diagonal-rl" },
      display:
        '<div class="math-layout diagonal"><span class="editable-box top-left"></span><span class="editable-box bottom-right"></span></div>',
    },
    {
      type: "blot",
      blotName: "sub-super-script",
      content: { layout: "vertical-right" },
      display:
        '<div class="math-layout dual"><span class="editable-box top-middle-left"></span><div class="vertical-right"><span class="editable-box sup"></span><span class="editable-box sub"></span></div></div>',
    },
    {
      type: "blot",
      blotName: "sub-super-script",
      content: { layout: "vertical-left" },
      display:
        '<div class="math-layout dual"><span class="editable-box top-middle-right"></span><div class="vertical-left"><span class="editable-box sup"></span><span class="editable-box sub"></span></div></div>',
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "e<sup>-x</sup>" },
      display: '<div class="math-layout"><span>e<sup>-x</sup></span></div>',
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "x<sup>2</sup>" },
      display: '<div class="math-layout"><span>x<sup>2</sup></span></div>',
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "n<sub>1</sub>Y" },
      display: '<div class="math-layout"><span>n<sub>1</sub>Y</span></div>',
    },
  ],
  fraction: [
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "<sup>x</sup>/<sub>y</sub>" },
      display: "<sup>x</sup>/<sub>y</sub>",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "<sup>a+b</sup>/<sub>c-d</sub>" },
      display: "<sup>a+b</sup>/<sub>c-d</sub>",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "<sup>m^n</sup>/<sub>p^q</sub>" },
      display: "<sup>m^n</sup>/<sub>p^q</sub>",
    },
  ],
  radicals: [
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "√x" },
      display: "√x",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "∛y" },
      display: "∛y",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "∜z" },
      display: "∜z",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "∜[n]{a}" },
      display: "∜[n]{a}",
    },
  ],
  brackets: [
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "(x)" },
      display: "(x)",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "[y]" },
      display: "[y]",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "{z}" },
      display: "{z}",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "<x>" },
      display: "<x>",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "|v|" },
      display: "|v|",
    },
  ],
  summations: [
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "∑<sub>i=1</sub><sup>n</sup> i" },
      display: "∑<sub>i=1</sub><sup>n</sup> i",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "∑<sub>k=0</sub><sup>∞</sup> x<sup>k</sup>" },
      display: "∑<sub>k=0</sub><sup>∞</sup> x<sup>k</sup>",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "∑<sub>j=1</sub><sup>m</sup> j<sup>2</sup>" },
      display: "∑<sub>j=1</sub><sup>m</sup> j<sup>2</sup>",
    },
  ],
  trigonometry: [
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "sin θ" },
      display: "sin θ",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "cos φ" },
      display: "cos φ",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "tan ψ" },
      display: "tan ψ",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "sin<sup>-1</sup> x" },
      display: "sin<sup>-1</sup> x",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "cos<sup>-1</sup> y" },
      display: "cos<sup>-1</sup> y",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "tan<sup>-1</sup> z" },
      display: "tan<sup>-1</sup> z",
    },
  ],
  integrals: [
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "∫ f(x) dx" },
      display: "∫ f(x) dx",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "∫<sub>a</sub><sup>b</sup> g(x) dx" },
      display: "∫<sub>a</sub><sup>b</sup> g(x) dx",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "∬ f(x, y) dxdy" },
      display: "∬ f(x, y) dxdy",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "∮ C f(z) dz" },
      display: "∮ C f(z) dz",
    },
  ],
  logs: [
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "log<sub>2</sub> x" },
      display: "log<sub>2</sub> x",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "ln x" },
      display: "ln x",
    },
    {
      type: "blot",
      blotName: "math-expression",
      content: { content: "lim<sub>n→∞</sub> (1 + 1/n)<sup>n</sup>" },
      display: "lim<sub>n→∞</sub> (1 + 1/n)<sup>n</sup>",
    },
  ],
};

// --- SINGLE SOURCE OF TRUTH FOR STATE ---
let activeBlotElement = null;

// --- CORE STATE MANAGEMENT ---

function deactivateActiveBlot() {
  if (!activeBlotElement) return;

  const elementToDeactivate = activeBlotElement;
  activeBlotElement = null;

  elementToDeactivate.classList.remove("active");
  removeControls(elementToDeactivate);

  // Handle editable boxes
  const editableBoxes = elementToDeactivate.querySelectorAll(".editable-box");
  editableBoxes.forEach((box) => {
    box.removeAttribute("contenteditable");
  });

  // Handle math-content divs
  const mathContent = elementToDeactivate.querySelector(".math-content");
  if (mathContent) {
    mathContent.removeAttribute("contenteditable");
  }
}

function activateBlot(elementToActivate) {
  if (!elementToActivate || elementToActivate === activeBlotElement) {
    return;
  }

  deactivateActiveBlot();

  activeBlotElement = elementToActivate;
  elementToActivate.classList.add("active");
  addControls(elementToActivate);
  makeEditable(elementToActivate);
}

// --- EDITOR AND UI LOGIC ---

function insertIntoEditor(data, lastKnownRange) {
  const quill = window.focusedEditor;
  if (!quill) return;

  // Restore focus to the editor
  quill.focus();

  // Restore cursor position
  if (lastKnownRange) {
    quill.setSelection(lastKnownRange.index, lastKnownRange.length, "silent");
  }

  const range = quill.getSelection(true);
  if (!range) return;

  if (typeof data === "string") {
    quill.insertText(range.index, data, "user");
    quill.setSelection(range.index + data.length, "silent");
    return;
  }

  if (data.type === "blot" && data.blotName) {
    const originalIndex = range.index;
    quill.insertEmbed(originalIndex, data.blotName, data.content, "user");
    quill.setSelection(originalIndex + 1, "silent");

    // Activate both types of math expressions
    setTimeout(() => {
      const [leaf] = quill.getLeaf(originalIndex);
      if (leaf && leaf.domNode) {
        const blotNode = leaf.domNode;
        activateBlot(blotNode);

        if (!blotNode.hasAttribute("data-dblclick-attached")) {
          blotNode.setAttribute("data-dblclick-attached", "true");
          blotNode.addEventListener("dblclick", (event) => {
            event.preventDefault();
            event.stopPropagation();
            activateBlot(blotNode);
          });
        }
      }
    }, 0);
  }
}

function makeEditable(element) {
  const quill = window.focusedEditor;

  // Handle sub-super-script with editable boxes
  const editableBoxes = element.querySelectorAll(".editable-box");
  if (editableBoxes.length > 0) {
    editableBoxes.forEach((box) => {
      box.contentEditable = "true";
      box.addEventListener("focus", () => quill.disable());
      box.addEventListener("blur", () => quill.enable());
      box.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const blot = Quill.find(element);
          deactivateActiveBlot();
          if (blot) {
            const index = quill.getIndex(blot) + blot.length();
            quill.setSelection(index, 0, "user");
            quill.focus();
          }
        }
      });
    });
  }
  // Handle math-expression with math-content div
  else if (element.classList.contains("math-expression-blot")) {
    const mathContent = element.querySelector(".math-content");
    if (mathContent) {
      mathContent.contentEditable = "true";
      mathContent.addEventListener("focus", () => quill.disable());
      mathContent.addEventListener("blur", () => quill.enable());
      mathContent.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const blot = Quill.find(element);
          deactivateActiveBlot();
          if (blot) {
            const index = quill.getIndex(blot) + blot.length();
            quill.setSelection(index, 0, "user");
            quill.focus();
          }
        }
      });
    }
  }
}

function renderExpressions(containerId, expressionsArray) {
  const expressionGrid = document.getElementById(containerId);
  expressionGrid.innerHTML = "";
  if (!expressionsArray) return;

  expressionsArray.forEach((expressionObj) => {
    const div = document.createElement("div");
    div.className = "expression";
    div.innerHTML = expressionObj.display;
    div.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const quill = window.focusedEditor;
      if (quill) {
        // Save the selection *before* calling the insertion function.
        savedRange = quill.getSelection();
        insertIntoEditor(expressionObj);
      }
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
      const quill = window.focusedEditor;
      if (quill) {
        // Save the selection *before* calling the insertion function.
        savedRange = quill.getSelection();
        insertIntoEditor(symbol);
      }
    });
    symbolGrid.appendChild(div);
  });
}

// --- Toggling and Initialization ---

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

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const subcatButtons = document.querySelectorAll(".subcat-button");
  tabButtons.forEach((button) => button.addEventListener("click", toggleTab));
  subcatButtons.forEach((button) =>
    button.addEventListener("click", toggleSubcategory)
  );

  renderSubcategory("basic-maths");
  renderExpressionSubcategory("sub-super-scripts");

  document.addEventListener(
    "click",
    (event) => {
      if (activeBlotElement && !activeBlotElement.contains(event.target)) {
        deactivateActiveBlot();
      }
    },
    true
  );
});

// --- CONTROL-ADDING FUNCTIONS ---

function addControls(element) {
  if (element.querySelector(".controls")) return;
  const controls = document.createElement("div");
  controls.className = "controls";
  controls.innerHTML = `<span class="resizer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.5 12h-19m15.833 3.167L21.5 12l-3.167-3.167M5.667 15.167L2.5 12l3.167-3.167m3.166 9.5L12 21.5l3.167-3.167M8.833 5.667L12 2.5l3.167 3.167M12 21.5v-19"/></svg></span><span class="dropdown-trigger"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="none"/><path fill="#fff" d="m9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828L5.757 6.586L4.343 8z"/></svg></span>`;
  element.appendChild(controls);
  enableRuler(element);
  addDropdown(element);
}

function removeControls(element) {
  const controls = element.querySelector(".controls");
  if (controls) {
    controls.remove();
  }
}

function enableRuler(element) {
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

// function addControls(element) {
//   if (element.querySelector(".controls")) return;
//   const controls = document.createElement("div");
//   controls.className = "controls";
//   controls.innerHTML = `<span class="resizer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.5 12h-19m15.833 3.167L21.5 12l-3.167-3.167M5.667 15.167L2.5 12l3.167-3.167m3.166 9.5L12 21.5l3.167-3.167M8.833 5.667L12 2.5l3.167 3.167M12 21.5v-19"/></svg></span><span class="dropdown-trigger"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="none"/><path fill="#fff" d="m9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828L5.757 6.586L4.343 8z"/></svg></span>`;
//   element.appendChild(controls);

//   enableRuler(element);
//   addDropdown(element);
// }
