/**
 * quill.paraphrase.js
 * Implements Full "Split View" Paraphrasing with Synced Highlighting
 */

// --- Configuration ---
const HF_API_KEY = ""; // <--- Add your Hugging Face Token here (optional for demo)
const HF_MODEL = "facebook/bart-large-cnn";

// --- State Management ---
let paraState = {
  sentences: [], // Array of Original Sentences
  paraphrased: [], // Array of Result Sentences (null if loading)
  currentIndex: 0, // The active sentence index (highlights purple)
  isModeOpen: false,
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  setupParaphraseTrigger();
  injectParaphraseUI();
});

function setupParaphraseTrigger() {
  // Find "Paraphrase" in your existing dropdown
  const items = document.querySelectorAll(".grammar-dropdown-item span");
  items.forEach((span) => {
    if (span.textContent.trim() === "Paraphrase") {
      span.parentElement.addEventListener("click", (e) => {
        e.stopPropagation();
        // Close the dropdown
        const dropdown = document.getElementById("grammarDropdown");
        if (dropdown) dropdown.classList.remove("open");
        // Show the badge
        initParaphraseBadge();
      });
    }
  });
}

function initParaphraseBadge() {
  if (document.getElementById("paraphrase-btn-badge")) return;

  const badge = document.createElement("div");
  badge.id = "paraphrase-btn-badge";
  badge.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h10"/><path d="M9 16l4-4-4-4"/><path d="M12 12h10"/><path d="M19 16l-4-4 4-4"/></svg>
        <span>Paraphrase</span>
    `;
  badge.addEventListener("click", openParaphraseMode);
  document.body.appendChild(badge);
}

// --- UI Structure (HTML Injection) ---
function injectParaphraseUI() {
  if (document.getElementById("paraphrase-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "paraphrase-overlay";
  overlay.innerHTML = `
        <!-- Header -->
        <div class="paraphrase-header">
            <div class="paraphrase-title">Paraphrase</div>
            <button class="close-paraphrase" id="closeParaBtn">&times;</button>
        </div>

        <!-- Main Content (Two Columns) -->
        <div class="paraphrase-container">
            <!-- Left: Original -->
            <div class="para-paper-wrapper">
                <div class="para-paper-label">Original</div>
                <div class="para-editor-box" id="para-source-box"></div>
            </div>

            <!-- Right: Paraphrased -->
            <div class="para-paper-wrapper">
                <div class="para-paper-label" style="color:#7c4dff">Paraphrased Output</div>
                <div class="para-editor-box" id="para-target-box"></div>
            </div>
        </div>

        <!-- Footer Controls -->
        <div class="paraphrase-footer">
            <!-- Navigation Group -->
            <div class="footer-group">
                <button class="nav-btn" id="paraPrevBtn" title="Previous Sentence">
                    <!-- Up Arrow -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
                </button>
                <button class="nav-btn" id="paraNextBtn" title="Next Sentence">
                    <!-- Down Arrow -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                
                <div class="para-stats-text">
                    <span class="sentence-counter" id="paraCounter">0 / 0</span>
                    <span class="word-counter" id="paraWordCount">0 Words</span>
                </div>
            </div>

            <div class="footer-divider"></div>

            <!-- Actions Group -->
            <div class="footer-group">
                <button class="action-icon-btn" id="paraRegenBtn" title="Regenerate Active Sentence">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                </button>
                
                <button class="action-icon-btn" id="paraCopyBtn" title="Copy Text">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>

                <button class="insert-btn" id="paraInsertBtn">Replace All</button>
            </div>
        </div>
    `;

  document.body.appendChild(overlay);

  // Bind Events
  document
    .getElementById("closeParaBtn")
    .addEventListener("click", closeParaphraseMode);
  document
    .getElementById("paraPrevBtn")
    .addEventListener("click", () => focusSentence(paraState.currentIndex - 1));
  document
    .getElementById("paraNextBtn")
    .addEventListener("click", () => focusSentence(paraState.currentIndex + 1));

  document
    .getElementById("paraRegenBtn")
    .addEventListener("click", regenerateActive);
  document
    .getElementById("paraCopyBtn")
    .addEventListener("click", copyFullText);
  document
    .getElementById("paraInsertBtn")
    .addEventListener("click", replaceInEditor);
}

// --- Logic: Open & Parse ---

function openParaphraseMode() {
  if (!window.focusedEditor) {
    alert("Please click inside the editor to select text first.");
    return;
  }

  const fullText = window.focusedEditor.getText().trim();
  if (!fullText) {
    alert("Document is empty.");
    return;
  }

  const overlay = document.getElementById("paraphrase-overlay");
  overlay.classList.add("active");
  paraState.isModeOpen = true;

  // 1. Split Sentences (Using Intl if available, else Regex)
  try {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
      paraState.sentences = Array.from(segmenter.segment(fullText))
        .map((s) => s.segment.trim())
        .filter((s) => s.length > 0);
    } else {
      throw new Error("No Segmenter");
    }
  } catch (e) {
    // Fallback Splitter
    paraState.sentences = fullText.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g) || [
      fullText,
    ];
    paraState.sentences = paraState.sentences
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  // 2. Initialize State
  paraState.paraphrased = new Array(paraState.sentences.length).fill(null);
  paraState.currentIndex = 0;

  // 3. Render Initial View
  renderFullUI();

  // 4. Start Processing Queue (Sentence 0 to End)
  processNextSentence(0);
}

function closeParaphraseMode() {
  document.getElementById("paraphrase-overlay").classList.remove("active");
  paraState.isModeOpen = false;
}

// --- Logic: Queue Processing ---

async function processNextSentence(index) {
  // Stop if closed or finished
  if (!paraState.isModeOpen || index >= paraState.sentences.length) return;

  // If already has data (from manual regen?), skip
  if (paraState.paraphrased[index] === null) {
    const original = paraState.sentences[index];
    const result = await fetchParaphrase(original);
    paraState.paraphrased[index] = result;

    // Update UI to show new text
    renderFullUI();
  }

  // Continue to next
  processNextSentence(index + 1);
}

async function fetchParaphrase(text) {
  // MOCK MODE (If no Key)
  if (!HF_API_KEY) {
    await new Promise((r) => setTimeout(r, 600)); // Fake network delay
    return mockReword(text);
  }

  // REAL API MODE
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: "POST",
        body: JSON.stringify({
          inputs: text,
          parameters: { do_sample: true, max_length: 200, temperature: 0.9 },
        }),
      }
    );
    const data = await response.json();

    if (Array.isArray(data) && data[0].summary_text) {
      return data[0].summary_text;
    }
    return text; // Fallback on error
  } catch (e) {
    console.error("API Error", e);
    return text;
  }
}

// --- Logic: Render & Sync ---

function focusSentence(index) {
  if (index < 0 || index >= paraState.sentences.length) return;

  paraState.currentIndex = index;
  renderFullUI();
}

function renderFullUI() {
  // 1. Update Footer Stats
  const total = paraState.sentences.length;
  const current = total > 0 ? paraState.currentIndex + 1 : 0;

  document.getElementById("paraCounter").textContent = `${current} / ${total}`;

  // Calculate words in active sentence
  const activeText = paraState.sentences[paraState.currentIndex] || "";
  const wordCount = activeText ? activeText.split(/\s+/).length : 0;
  document.getElementById("paraWordCount").textContent = `${wordCount} Words`;

  // Button states
  document.getElementById("paraPrevBtn").disabled = paraState.currentIndex <= 0;
  document.getElementById("paraNextBtn").disabled =
    paraState.currentIndex >= total - 1;

  // 2. Render Left Box (Original)
  const sourceBox = document.getElementById("para-source-box");
  let sourceHTML = "";

  paraState.sentences.forEach((sent, i) => {
    const isActive = i === paraState.currentIndex;
    const activeClass = isActive ? "active-sentence" : "";
    const idAttr = isActive ? 'id="active-source-sent"' : ""; // Anchor for scroll

    sourceHTML += `<span class="para-sentence ${activeClass}" ${idAttr} onclick="focusSentence(${i})">${sent}</span> `;
  });
  sourceBox.innerHTML = sourceHTML;

  // 3. Render Right Box (Paraphrased)
  const targetBox = document.getElementById("para-target-box");
  let targetHTML = "";

  paraState.sentences.forEach((orig, i) => {
    const result = paraState.paraphrased[i];
    const isActive = i === paraState.currentIndex;
    const activeClass = isActive ? "active-sentence" : "";
    const idAttr = isActive ? 'id="active-target-sent"' : ""; // Anchor for scroll

    if (result === null) {
      // Loading State
      targetHTML += `<span class="para-sentence ${activeClass}" ${idAttr}><span class="loading-text">Generating...</span></span> `;
    } else {
      // Diff Logic
      const diffedText = generateDiffHTML(orig, result);
      targetHTML += `<span class="para-sentence ${activeClass}" ${idAttr} onclick="focusSentence(${i})">${diffedText}</span> `;
    }
  });
  targetBox.innerHTML = targetHTML;

  // 4. Scroll Sync (Scroll both boxes to active element)
  setTimeout(() => {
    const activeSource = document.getElementById("active-source-sent");
    const activeTarget = document.getElementById("active-target-sent");

    if (activeSource) {
      activeSource.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (activeTarget) {
      activeTarget.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 10);
}

// --- Helper: Diff Algorithm ---

function generateDiffHTML(original, newText) {
  const origWords = original
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/);
  const newWords = newText.split(/\s+/);

  return newWords
    .map((word) => {
      const cleanWord = word
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      // If word is NOT in original, highlight orange
      // Ignore very short words to reduce noise
      if (!origWords.includes(cleanWord) && cleanWord.length > 2) {
        return `<span class="diff-change">${word}</span>`;
      }
      return word;
    })
    .join(" ");
}

function mockReword(text) {
  // Simple Mock for demo
  const map = {
    is: "represents",
    use: "leverage",
    important: "crucial",
    very: "highly",
    good: "stellar",
    the: "this",
    make: "create",
  };
  return text
    .split(" ")
    .map((w) => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, "");
      if (map[clean] && Math.random() > 0.4) return map[clean];
      return w;
    })
    .join(" ");
}

// --- Action Buttons ---

function regenerateActive() {
  // Clear data for active sentence
  paraState.paraphrased[paraState.currentIndex] = null;
  renderFullUI();
  // Trigger fetch again
  processNextSentence(paraState.currentIndex);
}

function copyFullText() {
  // Combine all current paraphrased segments (or fall back to original if loading)
  const text = paraState.sentences
    .map((s, i) => paraState.paraphrased[i] || s)
    .join(" ");
  navigator.clipboard.writeText(text);

  // Visual feedback
  const btn = document.getElementById("paraCopyBtn");
  btn.style.color = "#7c4dff";
  setTimeout(() => (btn.style.color = ""), 1000);
}

function replaceInEditor() {
  if (!window.focusedEditor) return;

  const text = paraState.sentences
    .map((s, i) => paraState.paraphrased[i] || s)
    .join(" ");
  window.focusedEditor.setText(text);

  closeParaphraseMode();
}
