// class ToggleComponent {
//   constructor(buttonId, targetId) {
//     this.button = document.getElementsByClassName(buttonId);
//     this.target = document.getElementById(targetId);
//     this.isVisible = false;
//     this.button.forEach((button) => {
//       button.addEventListener("click", () => this.toggle());
//     });
//   }

//   toggle() {
//     console.log(this.target);
//     this.isVisible = !this.isVisible;
//     this.target.style.display = this.isVisible ? "block" : "none";
//   }
// }

// // Usage
// const toggle = new ToggleComponent("equationButton", "equations_and_symbols");

// // Arrays of symbols for each subcategory
// const basicMathsSymbols = [
//   "±",
//   "∞",
//   "≠",
//   "#",
//   "~",
//   "×",
//   "÷",
//   "!",
//   "α",
//   "<",
//   "≪",
//   ">",
//   ">>",
//   "≤",
//   "≥",
//   "≠",
//   "=",
//   "∀",
//   "∁",
//   "∂",
//   "∮",
//   "∇",
//   "√",
//   "∝",
//   "∪",
//   "∩",
//   "∅",
//   "%",
//   "°",
//   "°F",
//   "°C",
//   "Δ",
//   "∀",
//   "∃",
//   "∈",
//   "∉",
//   "←",
//   "↑",
//   "→",
//   "↓",
//   "↔",
//   "↕",
//   "…",
//   "+",
//   "−",
//   "÷",
//   "×",
//   "a",
//   "β",
//   "γ",
//   "δ",
//   "ε",
//   "θ",
//   "λ",
//   "μ",
//   "π",
//   "ρ",
//   "σ",
//   "τ",
//   "φ",
//   "ψ",
//   "*",
//   ".",
//   ":",
//   "∴",
//   "∵",
//   "∧",
//   "∨",
//   "⊥",
//   "⊤",
//   "⊢",
//   "⊣",
// ];

// const negationsSymbols = [
//   "≠",
//   "⋠",
//   "⋡",
//   "⋢",
//   "⋣",
//   "≢",
//   "≁",
//   "≇",
//   "≄",
//   "≄",
//   "≁",
//   "≂̸",
//   "≉",
//   "≭",
//   "≭",
//   "≏",
//   "≓̸",
//   "≖̸",
//   "⊄",
//   "⊅",
//   "⊈",
//   "⊉",
//   "⊬",
//   "⊭",
//   "⊯",
//   "⊰",
//   "⊱",
//   "⋪",
//   "⋫",
//   "⋬",
//   "⋭",
//   "⊶̸",
//   "⊷̸",
//   "⋋̸",
//   "⋌̸",
//   "⋍̸",
//   "⇍",
//   "⇎",
//   "⇏",
//   "⇎",
//   "⇚",
//   "⇛̸",
// ];

// const geometrySymbols = [
//   "⌞",
//   "∡",
//   "⦤",
//   "⦣",
//   "⌟",
//   "⟀",
//   "⧫",
//   "⊥",
//   "⫽",
//   "⫻",
//   "∥",
//   "⫼",
//   "∶",
//   "∷",
//   "∴",
//   "∵",
//   "▮",
// ];

// // Simplified expressions that work with Quill
// const expressions = {
//   "sub-super-scripts": [
//     "□<sup>□</sup>",
//     "x<sub>□</sub>",
//     "x<sup>□</sup><sub>□</sub>",
//     "e<sup>□</sup>",
//     "x<sup>2</sup>",
//     "η<sub>γ</sub>",
//     "a<sup>n</sup>",
//     "x<sub>i</sub>",
//     "y<sup>3</sup>",
//     "z<sup>a</sup><sub>b</sub>",
//   ],
//   fraction: [
//     "<sup>□</sup>⁄<sub>□</sub>",
//     "<sup>a+b</sup>⁄<sub>c-d</sub>",
//     "<sup>□</sup>⁄<sub>□<sup>□</sup></sub>",
//     "<sup>x</sup>⁄<sub>y</sub>",
//     "<sup>a+b</sup>⁄<sub>c-d</sub>",
//     "<sup>1</sup>⁄<sub>2</sub>",
//     "<sup>π</sup>⁄<sub>4</sub>",
//   ],
//   radicals: [
//     "√□",
//     "∛□",
//     "∜□",
//     "<sup>□</sup>√□",
//     "√x",
//     "∛y",
//     "∜z",
//     "√(x+y)",
//     "∛(abc)",
//     "<sup>3</sup>√8",
//   ],
//   brackets: [
//     "(□)",
//     "[□]",
//     "{□}",
//     "⟨□⟩",
//     "|□|",
//     "(x+y)",
//     "[a,b]",
//     "{x,y,z}",
//     "⟨u,v⟩",
//     "|x|",
//     "⌊x⌋",
//     "⌈x⌉",
//   ],
//   summations: [
//     "∑<sub>□</sub><sup>□</sup> □",
//     "∏<sub>□</sub><sup>□</sup> □",
//     "∑<sub>□=□</sub><sup>□</sup> □",
//     "∑<sub>i=1</sub><sup>n</sup> i",
//     "∑<sub>k=0</sub><sup>∞</sup> x<sup>k</sup>",
//     "∑<sub>j=1</sub><sup>m</sup> j<sup>2</sup>",
//     "∏<sub>i=1</sub><sup>n</sup> i",
//   ],
//   trigonometry: [
//     "sin □",
//     "cos □",
//     "tan □",
//     "csc □",
//     "sec □",
//     "cot □",
//     "sin<sup>-1</sup> □",
//     "cos<sup>-1</sup> □",
//     "tan<sup>-1</sup> □",
//     "sinh □",
//     "cosh □",
//     "tanh □",
//     "coth □",
//     "sinh<sup>-1</sup> □",
//     "cosh<sup>-1</sup> □",
//     "tanh<sup>-1</sup> □",
//     "coth<sup>-1</sup> □",
//     "sin θ",
//     "cos φ",
//     "tan ψ",
//   ],
//   integrals: [
//     "∫ □ dx",
//     "∫<sub>□</sub><sup>□</sup> □ dx",
//     "∬ □ dxdy",
//     "∮ □ dz",
//     "∫ f(x) dx",
//     "∫<sub>a</sub><sup>b</sup> g(x) dx",
//     "∬ f(x, y) dxdy",
//     "∮<sub>C</sub> f(z) dz",
//   ],
//   logs: [
//     "log<sub>□</sub> □",
//     "ln □",
//     "lim<sub>□→□</sub> □",
//     "log<sub>2</sub> x",
//     "ln x",
//     "log<sub>10</sub> y",
//     "lim<sub>n→∞</sub> (1 + 1/n)<sup>n</sup>",
//   ],
// };

// // Global variables for editor context
// let currentFocusedEditor = null;
// let currentSavedRange = null;
// let editorContext = "modal";

// // Board equation management with enhanced UI
// class BoardEquationManager {
//   constructor() {
//     this.equations = new Map();
//     this.selectedEquation = null;
//     this.isDragging = false;
//     this.dragOffset = { x: 0, y: 0 };
//     this.addStyles();

//     this.makeEditable = function (element) {
//       element.setAttribute("contenteditable", "true");
//       element.addEventListener("focus", () => this.selectEquation(element.id));
//       element.addEventListener("blur", () => {
//         // Save content when blurring
//         const equation = this.equations.get(element.id);
//         if (equation) {
//           equation.content = element.innerHTML;
//         }
//       });
//     };

//     // this.createResizeHandle = function (element) {
//     //   const handle = document.createElement("div");
//     //   handle.className = "resize-handle";
//     //   handle.innerHTML = "⤢";
//     //   handle.style.position = "absolute";
//     //   handle.style.bottom = "0";
//     //   handle.style.right = "0";
//     //   handle.style.width = "16px";
//     //   handle.style.height = "16px";
//     //   handle.style.cursor = "nwse-resize";
//     //   handle.style.backgroundColor = "#8b5cf6";
//     //   handle.style.color = "white";
//     //   handle.style.textAlign = "center";
//     //   handle.style.lineHeight = "16px";
//     //   handle.style.fontSize = "12px";
//     //   handle.style.borderRadius = "2px 0 4px 0";

//     //   // Make resizable
//     //   handle.addEventListener("mousedown", (e) => {
//     //     e.preventDefault();
//     //     e.stopPropagation();

//     //     const startWidth = element.offsetWidth;
//     //     const startHeight = element.offsetHeight;
//     //     const startX = e.clientX;
//     //     const startY = e.clientY;

//     //     function doResize(e) {
//     //       const newWidth = startWidth + (e.clientX - startX);
//     //       const newHeight = startHeight + (e.clientY - startY);
//     //       element.style.width = Math.max(100, newWidth) + "px";
//     //       element.style.height = Math.max(40, newHeight) + "px";
//     //     }

//     //     function stopResize() {
//     //       document.removeEventListener("mousemove", doResize);
//     //       document.removeEventListener("mouseup", stopResize);
//     //     }

//     //     document.addEventListener("mousemove", doResize);
//     //     document.addEventListener("mouseup", stopResize);
//     //   });

//     //   return handle;
//     // };
//   }
//   createResizeHandle(element) {
//     const handle = document.createElement("div");
//     handle.className = "resize-handle";
//     handle.innerHTML = "⤢";

//     // Make resizable
//     handle.addEventListener("mousedown", (e) => {
//       e.preventDefault();
//       e.stopPropagation();

//       const startWidth = element.offsetWidth;
//       const startHeight = element.offsetHeight;
//       const startX = e.clientX;
//       const startY = e.clientY;

//       function doResize(e) {
//         const newWidth = startWidth + (e.clientX - startX);
//         const newHeight = startHeight + (e.clientY - startY);
//         element.style.width = Math.max(100, newWidth) + "px";
//         element.style.height = Math.max(40, newHeight) + "px";
//       }

//       function stopResize() {
//         document.removeEventListener("mousemove", doResize);
//         document.removeEventListener("mouseup", stopResize);
//       }

//       document.addEventListener("mousemove", doResize);
//       document.addEventListener("mouseup", stopResize);
//     });

//     return handle;
//   }
//   addStyles() {
//     if (!document.getElementById("board-equation-styles")) {
//       const style = document.createElement("style");
//       style.id = "board-equation-styles";
//       style.textContent = `
//         .board-equation {
//           position: absolute;
//           border: 2px solid #8b5cf6;
//           padding: 8px;
//           background-color: white;
//           min-width: 100px;
//           min-height: 40px;
//           cursor: move;
//           user-select: none;
//           border-radius: 4px;
//         }

//         .board-equation.selected {
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
//         }

//         .equation-controls {
//           position: absolute;
//           top: -30px;
//           right: 0;
//           display: flex;
//           gap: 4px;
//           opacity: 0;
//           transition: opacity 0.2s;
//         }

//         .board-equation.selected .equation-controls {
//           opacity: 1;
//         }

//         .control-btn {
//           width: 24px;
//           height: 24px;
//           background: #8b5cf6;
//           border: none;
//           border-radius: 4px;
//           color: white;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 12px;
//           transition: background-color 0.2s;
//         }

//         .control-btn:hover {
//           background: #7c3aed;
//         }

//         .move-controls {
//           position: absolute;
//           top: -30px;
//           left: 0;
//           display: flex;
//           gap: 2px;
//           opacity: 0;
//           transition: opacity 0.2s;
//         }

//         .board-equation.selected .move-controls {
//           opacity: 1;
//         }

//         .move-btn {
//           width: 20px;
//           height: 20px;
//           background: #6b7280;
//           border: none;
//           border-radius: 2px;
//           color: white;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 10px;
//           transition: background-color 0.2s;
//         }

//         .move-btn:hover {
//           background: #4b5563;
//         }
//       `;
//       document.head.appendChild(style);
//     }
//   }

//   createEquation(x, y, content = "") {
//     const id = "eq_" + Date.now();
//     const equation = {
//       id: id,
//       x: x,
//       y: y,
//       content: content,
//       element: this.createElement(id, x, y, content),
//     };

//     this.equations.set(id, equation);
//     return equation;
//   }

//   createElement(id, x, y, content) {
//     const element = document.createElement("div");
//     element.className = "board-equation";
//     element.id = id;
//     element.style.left = x + "px";
//     element.style.top = y + "px";
//     element.style.minWidth = "100px";
//     element.style.minHeight = "40px";
//     element.style.zIndex = "1";
//     element.innerHTML = content || "Click to edit";

//     // Make editable
//     this.makeEditable(element);

//     // Create and add resize handle
//     const resizeHandle = this.createResizeHandle(element);
//     element.appendChild(resizeHandle);
//     // Create control buttons
//     const controls = document.createElement("div");
//     controls.className = "equation-controls";

//     // Move controls (left side)
//     const moveControls = document.createElement("div");
//     moveControls.className = "move-controls";

//     // Arrow buttons for movement
//     const moveUp = this.createMoveButton("↑", () =>
//       this.moveEquation(id, 0, -10)
//     );
//     const moveDown = this.createMoveButton("↓", () =>
//       this.moveEquation(id, 0, 10)
//     );
//     const moveLeft = this.createMoveButton("←", () =>
//       this.moveEquation(id, -10, 0)
//     );
//     const moveRight = this.createMoveButton("→", () =>
//       this.moveEquation(id, 10, 0)
//     );

//     moveControls.appendChild(moveUp);
//     moveControls.appendChild(moveDown);
//     moveControls.appendChild(moveLeft);
//     moveControls.appendChild(moveRight);

//     // Main controls (right side)
//     const editBtn = this.createControlButton("⚙", () =>
//       this.openEquationModal(id)
//     );
//     const deleteBtn = this.createControlButton("×", () =>
//       this.deleteEquation(id)
//     );

//     controls.appendChild(editBtn);
//     controls.appendChild(deleteBtn);

//     element.appendChild(moveControls);
//     element.appendChild(controls);

//     // Event listeners
//     // Modify the createElement method's event listeners:
//     element.addEventListener("click", (e) => {
//       if (e.target === element || e.target.classList.contains("placeholder")) {
//         e.stopPropagation();
//         this.selectEquation(id);
//         element.focus();

//         // If placeholder exists, remove it when clicking to edit
//         const placeholder = element.querySelector(".placeholder");
//         if (placeholder) {
//           placeholder.remove();
//         }
//       }
//     });

//     element.addEventListener("dblclick", (e) => {
//       e.stopPropagation();
//       element.focus();

//       // Select all content for easy replacement
//       const range = document.createRange();
//       range.selectNodeContents(element);
//       const selection = window.getSelection();
//       selection.removeAllRanges();
//       selection.addRange(range);
//     });

//     // Drag functionality
//     element.addEventListener("mousedown", (e) => {
//       if (
//         e.target.classList.contains("control-btn") ||
//         e.target.classList.contains("move-btn")
//       ) {
//         return; // Don't drag when clicking buttons
//       }
//       this.startDrag(e, id);
//     });

//     const board = document.getElementById("board") || document.body;
//     board.appendChild(element);

//     return element;
//   }

//   createControlButton(text, onClick) {
//     const btn = document.createElement("button");
//     btn.className = "control-btn";
//     btn.textContent = text;
//     btn.addEventListener("click", (e) => {
//       e.stopPropagation();
//       onClick();
//     });
//     return btn;
//   }

//   createMoveButton(text, onClick) {
//     const btn = document.createElement("button");
//     btn.className = "move-btn";
//     btn.textContent = text;
//     btn.addEventListener("click", (e) => {
//       e.stopPropagation();
//       onClick();
//     });
//     return btn;
//   }

//   moveEquation(id, deltaX, deltaY) {
//     const equation = this.equations.get(id);
//     if (equation) {
//       equation.x += deltaX;
//       equation.y += deltaY;
//       equation.element.style.left = equation.x + "px";
//       equation.element.style.top = equation.y + "px";
//     }
//   }

//   startDrag(e, id) {
//     const equation = this.equations.get(id);
//     if (!equation) return;

//     this.isDragging = true;
//     this.selectEquation(id);

//     const rect = equation.element.getBoundingClientRect();
//     this.dragOffset.x = e.clientX - rect.left;
//     this.dragOffset.y = e.clientY - rect.top;

//     document.addEventListener("mousemove", this.handleDrag.bind(this));
//     document.addEventListener("mouseup", this.stopDrag.bind(this));
//   }

//   handleDrag(e) {
//     if (!this.isDragging || !this.selectedEquation) return;

//     const equation = this.equations.get(this.selectedEquation);
//     if (!equation) return;

//     const board = document.getElementById("board") || document.body;
//     const boardRect = board.getBoundingClientRect();

//     const newX = e.clientX - boardRect.left - this.dragOffset.x;
//     const newY = e.clientY - boardRect.top - this.dragOffset.y;

//     equation.x = Math.max(0, newX);
//     equation.y = Math.max(0, newY);

//     equation.element.style.left = equation.x + "px";
//     equation.element.style.top = equation.y + "px";
//   }

//   stopDrag() {
//     this.isDragging = false;
//     document.removeEventListener("mousemove", this.handleDrag.bind(this));
//     document.removeEventListener("mouseup", this.stopDrag.bind(this));
//   }

//   selectEquation(id) {
//     // Remove previous selection
//     if (this.selectedEquation) {
//       const prevElement = this.equations.get(this.selectedEquation)?.element;
//       if (prevElement) {
//         prevElement.classList.remove("selected");
//       }
//     }

//     // Select new equation
//     this.selectedEquation = id;
//     const equation = this.equations.get(id);
//     if (equation) {
//       equation.element.classList.add("selected");
//     }
//   }

//   deselectAll() {
//     if (this.selectedEquation) {
//       const element = this.equations.get(this.selectedEquation)?.element;
//       if (element) {
//         element.classList.remove("selected");
//       }
//     }
//     this.selectedEquation = null;
//   }

//   deleteEquation(id) {
//     const equation = this.equations.get(id);
//     if (equation) {
//       equation.element.remove();
//       this.equations.delete(id);
//       if (this.selectedEquation === id) {
//         this.selectedEquation = null;
//       }
//     }
//   }

//   openEquationModal(id) {
//     const equation = this.equations.get(id);
//     if (!equation) return;

//     // Create and show modal for equation settings
//     const modal = document.createElement("div");
//     modal.style.cssText = `
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background: rgba(0,0,0,0.5);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       z-index: 10000;
//     `;

//     const modalContent = document.createElement("div");
//     modalContent.style.cssText = `
//       background: white;
//       padding: 20px;
//       border-radius: 8px;
//       min-width: 300px;
//       max-width: 500px;
//     `;

//     modalContent.innerHTML = `
//       <h3>Equation Settings</h3>
//       <div style="margin: 10px 0;">
//         <label>Content:</label>
//         <textarea id="equation-content" style="width: 100%; height: 100px; margin-top: 5px;">${equation.content}</textarea>
//       </div>
//       <div style="margin: 10px 0;">
//         <label>Position X:</label>
//         <input type="number" id="equation-x" value="${equation.x}" style="width: 80px; margin-left: 10px;">
//         <label style="margin-left: 20px;">Position Y:</label>
//         <input type="number" id="equation-y" value="${equation.y}" style="width: 80px; margin-left: 10px;">
//       </div>
//       <div style="margin-top: 20px; text-align: right;">
//         <button id="cancel-btn" style="margin-right: 10px; padding: 8px 16px;">Cancel</button>
//         <button id="save-btn" style="padding: 8px 16px; background: #8b5cf6; color: white; border: none; border-radius: 4px;">Save</button>
//       </div>
//     `;

//     modal.appendChild(modalContent);
//     document.body.appendChild(modal);

//     // Event listeners
//     modal.addEventListener("click", (e) => {
//       if (e.target === modal) {
//         document.body.removeChild(modal);
//       }
//     });

//     modalContent.querySelector("#cancel-btn").addEventListener("click", () => {
//       document.body.removeChild(modal);
//     });

//     modalContent.querySelector("#save-btn").addEventListener("click", () => {
//       const newContent = modalContent.querySelector("#equation-content").value;
//       const newX = parseInt(modalContent.querySelector("#equation-x").value);
//       const newY = parseInt(modalContent.querySelector("#equation-y").value);

//       equation.content = newContent;
//       equation.x = newX;
//       equation.y = newY;
//       equation.element.innerHTML = newContent;
//       equation.element.style.left = newX + "px";
//       equation.element.style.top = newY + "px";

//       // Re-add controls
//       const controls = equation.element.querySelector(".equation-controls");
//       const moveControls = equation.element.querySelector(".move-controls");
//       if (controls) equation.element.appendChild(controls);
//       if (moveControls) equation.element.appendChild(moveControls);

//       document.body.removeChild(modal);
//     });
//   }

//   editEquation(id) {
//     const equation = this.equations.get(id);
//     if (!equation) return;

//     this.focusEquation(id);

//     editorContext = "board";
//     currentFocusedEditor = {
//       getSelection: () => ({ index: 0, length: 0 }),
//       getLength: () => (equation.content ? equation.content.length : 0),
//       insertText: (index, text) => {
//         equation.content = (equation.content || "") + text;
//         equation.element.innerHTML = equation.content;
//         // Re-add controls after content update
//         this.readdControls(equation.element, id);
//       },
//       clipboard: {
//         dangerouslyPasteHTML: (index, html) => {
//           equation.content = (equation.content || "") + html;
//           equation.element.innerHTML = equation.content;
//           // Re-add controls after content update
//           this.readdControls(equation.element, id);
//         },
//       },
//     };

//     const modal = document.getElementById("equations_and_symbols");
//     if (modal) {
//       modal.style.display = "block";
//     }
//   }

//   readdControls(element, id) {
//     // Remove existing controls
//     const existingControls = element.querySelector(".equation-controls");
//     const existingMoveControls = element.querySelector(".move-controls");
//     if (existingControls) existingControls.remove();
//     if (existingMoveControls) existingMoveControls.remove();

//     // Re-add controls
//     const controls = document.createElement("div");
//     controls.className = "equation-controls";

//     const moveControls = document.createElement("div");
//     moveControls.className = "move-controls";

//     const moveUp = this.createMoveButton("↑", () =>
//       this.moveEquation(id, 0, -10)
//     );
//     const moveDown = this.createMoveButton("↓", () =>
//       this.moveEquation(id, 0, 10)
//     );
//     const moveLeft = this.createMoveButton("←", () =>
//       this.moveEquation(id, -10, 0)
//     );
//     const moveRight = this.createMoveButton("→", () =>
//       this.moveEquation(id, 10, 0)
//     );

//     moveControls.appendChild(moveUp);
//     moveControls.appendChild(moveDown);
//     moveControls.appendChild(moveLeft);
//     moveControls.appendChild(moveRight);

//     const editBtn = this.createControlButton("⚙", () =>
//       this.openEquationModal(id)
//     );
//     const deleteBtn = this.createControlButton("×", () =>
//       this.deleteEquation(id)
//     );

//     controls.appendChild(editBtn);
//     controls.appendChild(deleteBtn);

//     element.appendChild(moveControls);
//     element.appendChild(controls);
//   }

//   updateEquationContent(id, content) {
//     const equation = this.equations.get(id);
//     if (equation) {
//       equation.content = content;
//       equation.element.innerHTML = content;
//       this.readdControls(equation.element, id);
//     }
//   }
//   // Add these to your BoardEquationManager class
//   selectAllContent(element) {
//     const range = document.createRange();
//     range.selectNodeContents(element);
//     const selection = window.getSelection();
//     selection.removeAllRanges();
//     selection.addRange(range);
//   }

//   focusEquation(id) {
//     const equation = this.equations.get(id);
//     if (equation && equation.element) {
//       equation.element.focus();
//       this.selectAllContent(equation.element);
//     }
//   }
// }

// const mathBoardManager = new BoardEquationManager();

// // Enhanced insert function
// function insertIntoEditor(content, range) {
//   console.log("=== INSERT FUNCTION CALLED ===");
//   console.log("Content to insert:", content);
//   console.log("Editor context:", editorContext);

//   if (editorContext === "board" && mathBoardManager.selectedEquation) {
//     console.log("Inserting into board equation");
//     const equation = mathBoardManager.equations.get(
//       mathBoardManager.selectedEquation
//     );
//     if (equation) {
//       const currentContent = equation.content || "";
//       const newContent = currentContent + content + " ";
//       mathBoardManager.updateEquationContent(
//         mathBoardManager.selectedEquation,
//         newContent
//       );
//       console.log("Board content updated to:", newContent);
//       return;
//     }
//   }

//   let activeEditor = null;

//   if (window.focusedEditor) {
//     activeEditor = window.focusedEditor;
//   } else if (currentFocusedEditor) {
//     activeEditor = currentFocusedEditor;
//   } else {
//     const quillEditor = document.querySelector(".ql-editor");
//     if (quillEditor) {
//       const quillContainer = quillEditor.closest(".ql-container");
//       if (quillContainer && quillContainer.__quill) {
//         activeEditor = quillContainer.__quill;
//       }
//     }
//   }

//   if (!activeEditor) {
//     console.error("No editor found!");
//     return;
//   }

//   try {
//     const selection = range ||
//       activeEditor.getSelection() || {
//         index: activeEditor.getLength() - 1,
//         length: 0,
//       };

//     if (/<[a-z][\s\S]*>/i.test(content)) {
//       activeEditor.clipboard.dangerouslyPasteHTML(
//         selection.index,
//         content + " "
//       );
//     } else {
//       activeEditor.insertText(selection.index, content + " ");
//     }

//     setTimeout(() => {
//       const newPosition = selection.index + content.length + 1;
//       activeEditor.setSelection(newPosition);
//     }, 10);
//   } catch (error) {
//     console.error("Error inserting content:", error);
//   }
// }

// // Function to render expressions
// function renderExpressions(containerId, expressionsArray) {
//   const expressionGrid = document.getElementById(containerId);
//   if (!expressionGrid) return;

//   expressionGrid.innerHTML = "";

//   expressionsArray.forEach((expression, index) => {
//     const div = document.createElement("div");
//     div.className = "expression";
//     div.innerHTML = expression;

//     if (expression.includes("□")) {
//       div.style.backgroundColor = "#e0e0e0";
//     } else {
//       div.style.border = "1px solid #e0e0e0";
//       div.style.backgroundColor = "white";
//     }

//     div.style.display = "inline-block";
//     div.style.margin = "4px";
//     div.style.padding = "8px";
//     div.style.borderRadius = "4px";
//     div.style.cursor = "pointer";
//     div.style.minWidth = "60px";
//     div.style.textAlign = "center";

//     div.addEventListener("mousedown", (e) => {
//       e.preventDefault();

//       const quillEditor = document.querySelector(".ql-editor");
//       if (quillEditor) {
//         const quillContainer = quillEditor.closest(".ql-container");
//         if (quillContainer && quillContainer.__quill) {
//           currentFocusedEditor = quillContainer.__quill;
//           window.focusedEditor = quillContainer.__quill;
//         }
//       }

//       insertIntoEditor(expression, null);
//     });

//     div.addEventListener("mouseover", () => {
//       div.style.backgroundColor =
//         div.style.backgroundColor === "rgb(248, 249, 255)"
//           ? "#e8e9ff"
//           : "#f0f0f0";
//     });

//     div.addEventListener("mouseout", () => {
//       div.style.backgroundColor = expression.includes("□")
//         ? "#f8f9ff"
//         : "white";
//     });

//     expressionGrid.appendChild(div);
//   });
// }

// // Function to render symbols
// function renderSymbols(containerId, symbolsArray) {
//   const symbolGrid = document.getElementById(containerId);
//   if (!symbolGrid) return;

//   symbolGrid.innerHTML = "";
//   symbolsArray.forEach((symbol) => {
//     const div = document.createElement("div");
//     div.className = "symbol";
//     div.textContent = symbol;
//     div.style.display = "inline-block";
//     div.style.margin = "4px";
//     div.style.padding = "8px";
//     div.style.border = "1px solid #e0e0e0";
//     div.style.borderRadius = "4px";
//     div.style.cursor = "pointer";
//     div.style.minWidth = "40px";
//     div.style.textAlign = "center";

//     div.addEventListener("mousedown", (e) => {
//       e.preventDefault();

//       const quillEditor = document.querySelector(".ql-editor");
//       if (quillEditor) {
//         const quillContainer = quillEditor.closest(".ql-container");
//         if (quillContainer && quillContainer.__quill) {
//           currentFocusedEditor = quillContainer.__quill;
//           window.focusedEditor = quillContainer.__quill;
//         }
//       }

//       insertIntoEditor(symbol, null);
//     });

//     div.addEventListener("mouseover", () => {
//       div.style.backgroundColor = "#f0f0f0";
//     });

//     div.addEventListener("mouseout", () => {
//       div.style.backgroundColor = "white";
//     });

//     symbolGrid.appendChild(div);
//   });
// }

// // Function to toggle main tabs
// function toggleTab(event) {
//   const tabButtons = document.querySelectorAll(".tab-button");
//   const tabContents = document.querySelectorAll(".tab-content");

//   tabButtons.forEach((button) => button.classList.remove("active"));
//   tabContents.forEach((content) => content.classList.remove("active"));

//   const targetTab = event.target.dataset.tab;
//   event.target.classList.add("active");
//   document.getElementById(targetTab).classList.add("active");

//   if (targetTab === "symbols") {
//     renderSubcategory("basic-maths");
//   } else if (targetTab === "expressions") {
//     renderExpressionSubcategory("sub-super-scripts");
//   }
// }

// // Function to toggle subcategory tabs
// function toggleSubcategory(event) {
//   const subcatButtons = document.querySelectorAll(".subcat-button");
//   subcatButtons.forEach((button) => button.classList.remove("active"));

//   const targetSubcat = event.target.dataset.subcat;
//   event.target.classList.add("active");

//   const activeTab = document.querySelector(".tab-content.active").id;

//   if (activeTab === "symbols") {
//     switch (targetSubcat) {
//       case "basic-maths":
//         renderSymbols("symbolGrid", basicMathsSymbols);
//         break;
//       case "negations":
//         renderSymbols("symbolGrid", negationsSymbols);
//         break;
//       case "geometry":
//         renderSymbols("symbolGrid", geometrySymbols);
//         break;
//       default:
//         renderSymbols("symbolGrid", basicMathsSymbols);
//     }
//   } else if (activeTab === "expressions") {
//     renderExpressions("expressionGrid", expressions[targetSubcat]);
//   }
// }

// // Helper functions
// function renderSubcategory(subcat) {
//   const subcatButtons = document.querySelectorAll(".subcat-button");
//   subcatButtons.forEach((button) => button.classList.remove("active"));

//   const targetButton = document.querySelector(`[data-subcat="${subcat}"]`);
//   if (targetButton) {
//     targetButton.classList.add("active");
//   }

//   switch (subcat) {
//     case "basic-maths":
//       renderSymbols("symbolGrid", basicMathsSymbols);
//       break;
//     case "negations":
//       renderSymbols("symbolGrid", negationsSymbols);
//       break;
//     case "geometry":
//       renderSymbols("symbolGrid", geometrySymbols);
//       break;
//     default:
//       renderSymbols("symbolGrid", basicMathsSymbols);
//   }
// }

// function renderExpressionSubcategory(subcat) {
//   const subcatButtons = document.querySelectorAll(".subcat-button");
//   subcatButtons.forEach((button) => button.classList.remove("active"));

//   const targetButton = document.querySelector(`[data-subcat="${subcat}"]`);
//   if (targetButton) {
//     targetButton.classList.add("active");
//   }

//   renderExpressions("expressionGrid", expressions[subcat]);
// }

// // Board interaction handlers
// function handleBoardClick(event) {
//   if (
//     event.target.id === "board" ||
//     event.target.classList.contains("board-container")
//   ) {
//     // Deselect all equations when clicking empty space
//     mathBoardManager.deselectAll();

//     const rect = event.target.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     const equation = mathBoardManager.createEquation(x, y);
//     mathBoardManager.selectEquation(equation.id);
//   }
// }

// // Initialize event listeners
// document.addEventListener("DOMContentLoaded", () => {
//   const tabButtons = document.querySelectorAll(".tab-button");
//   const subcatButtons = document.querySelectorAll(".subcat-button");

//   tabButtons.forEach((button) => button.addEventListener("click", toggleTab));
//   subcatButtons.forEach((button) =>
//     button.addEventListener("click", toggleSubcategory)
//   );

//   const board = document.getElementById("board");
//   if (board) {
//     board.addEventListener("click", handleBoardClick);
//   }

//   // Global click handler to deselect equations
//   document.addEventListener("click", (e) => {
//     if (
//       !e.target.closest(".board-equation") &&
//       !e.target.closest("#equations_and_symbols")
//     ) {
//       mathBoardManager.deselectAll();
//     }
//   });

//   const modal = document.getElementById("equations_and_symbols");
//   if (modal) {
//     modal.addEventListener("click", (e) => {
//       if (e.target === modal) {
//         modal.style.display = "none";
//         editorContext = "modal";
//         currentFocusedEditor = null;
//       }
//     });
//   }

//   // Initial render
//   renderSubcategory("basic-maths");
//   renderExpressionSubcategory("sub-super-scripts");
// });

// // Enhanced Quill editor focus handlers
// document.addEventListener("focusin", (e) => {
//   if (e.target.classList.contains("ql-editor")) {
//     editorContext = "modal";
//     const quillContainer = e.target.closest(".ql-container");
//     if (quillContainer && quillContainer.__quill) {
//       currentFocusedEditor = quillContainer.__quill;
//       window.focusedEditor = quillContainer.__quill;
//     }
//   }
// });

// // Additional click handler to ensure editor is detected
// document.addEventListener("click", (e) => {
//   if (
//     e.target.classList.contains("ql-editor") ||
//     e.target.closest(".ql-editor")
//   ) {
//     const quillEditor = e.target.classList.contains("ql-editor")
//       ? e.target
//       : e.target.closest(".ql-editor");
//     const quillContainer = quillEditor.closest(".ql-container");
//     if (quillContainer && quillContainer.__quill) {
//       currentFocusedEditor = quillContainer.__quill;
//       window.focusedEditor = quillContainer.__quill;
//       editorContext = "modal";
//     }
//   }
// });

// // Export for global access
// window.mathBoardManager = mathBoardManager;
// window.insertIntoEditor = insertIntoEditor;

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
