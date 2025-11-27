const grammarChecker = document.querySelector(
  ".grammar_checker_document_element"
);
const grammarDropdown = document.querySelector("#grammarDropdown");
const smartChipsDropdown = document.getElementById("smart-chips-dropdown");

// --- 1. Dropdown Toggle Logic (Same pattern as smart chips) ---
grammarChecker.addEventListener("click", (e) => {
  e.stopPropagation();
  // Close smart chips dropdown when grammar is clicked
  if (smartChipsDropdown) {
    smartChipsDropdown.classList.remove("open");
  }
  // Toggle grammar dropdown
  grammarDropdown.classList.toggle("open");
});

// Close dropdown when clicking outside (closes both grammar and smart chips)
document.addEventListener("click", () => {
  grammarDropdown.classList.remove("open");
  if (smartChipsDropdown) {
    smartChipsDropdown.classList.remove("open");
  }
});

// Prevent dropdown from closing when clicking inside it
grammarDropdown.addEventListener("click", (e) => e.stopPropagation());

/**
 * quill.grammar.js
 * Implements Grammar Check using LanguageTool Public API
 */

// State
let grammarState = {
  issues: [],
  currentTab: "all", // 'all', 'grammar', 'recommendation'
  sidebarOpen: false,
};

// --- 1. Initialization & Event Listeners ---

document.addEventListener("DOMContentLoaded", () => {
  const grammarCheckBtn = document.querySelector(
    "#grammarDropdown .grammar-dropdown-item span"
  ); // The "Check" button text

  if (grammarCheckBtn && grammarCheckBtn.textContent === "Check") {
    grammarCheckBtn.parentElement.addEventListener("click", () => {
      // Close dropdown
      const dropdown = document.getElementById("grammarDropdown");
      if (dropdown) dropdown.classList.remove("open");

      initGrammarBadge();
    });
  }

  // Inject Sidebar HTML once
  createGrammarSidebar();
});

// --- 2. UI Generation Functions ---

function initGrammarBadge() {
  // Remove existing badge if any
  const existing = document.getElementById("grammar-check-badge");
  if (existing) existing.remove();

  const badge = document.createElement("div");
  badge.id = "grammar-check-badge";
  badge.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span>Run Check</span>
    `;

  document.body.appendChild(badge);

  badge.addEventListener("click", () => {
    openGrammarSidebar();
    runGrammarCheck();
  });
}

function createGrammarSidebar() {
  const sidebar = document.createElement("div");
  sidebar.id = "grammar-sidebar";
  sidebar.innerHTML = `
      <div class="grammar-header">
        <h3>Grammar Check</h3>
        <button class="close-grammar-btn">&times;</button>
      </div>
      <div class="grammar-tabs">
        <div class="grammar-tab active" data-tab="all">All (0)</div>
        <div class="grammar-tab" data-tab="grammar">Grammar (0)</div>
        <div class="grammar-tab" data-tab="recommendation">Recs (0)</div>
      </div>
      <div class="grammar-content" id="grammar-results">
        <div class="grammar-loading">Click "Run Check" to start.</div>
      </div>
    `;

  document.body.appendChild(sidebar);

  // Close Button Logic
  sidebar
    .querySelector(".close-grammar-btn")
    .addEventListener("click", closeGrammarSidebar);

  // Tab Logic
  const tabs = sidebar.querySelectorAll(".grammar-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      // Switch active class
      tabs.forEach((t) => t.classList.remove("active"));
      e.target.classList.add("active");

      // Update state and render
      grammarState.currentTab = e.target.dataset.tab;
      renderIssues();
    });
  });
}

function openGrammarSidebar() {
  const sidebar = document.getElementById("grammar-sidebar");
  sidebar.classList.add("open");
  grammarState.sidebarOpen = true;
}

function closeGrammarSidebar() {
  const sidebar = document.getElementById("grammar-sidebar");
  sidebar.classList.remove("open");
  grammarState.sidebarOpen = false;
  // Optional: Clear highlights when closing
  clearHighlights();
}

// --- 3. Core Logic (API & Processing) ---

async function runGrammarCheck() {
  if (!window.focusedEditor) {
    alert("No editor detected.");
    return;
  }

  const resultsContainer = document.getElementById("grammar-results");
  resultsContainer.innerHTML = `<div class="grammar-loading">Scanning document...<br><small>Powered by LanguageTool</small></div>`;

  const text = window.focusedEditor.getText();

  // LanguageTool API (Free Public Endpoint)
  // Note: For production, you should proxy this through your backend to avoid CORS/Rate limits or buy a key.
  const apiUrl = "https://api.languagetool.org/v2/check";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text: text,
        language: "en-US",
        enabledOnly: "false",
      }),
    });

    const data = await response.json();
    processApiResults(data.matches);
  } catch (error) {
    console.error("Grammar Check Error:", error);
    resultsContainer.innerHTML = `<div class="grammar-loading" style="color:red">Error connecting to service.<br>Please try again later.</div>`;
  }
}

function processApiResults(matches) {
  // Map matches to our structure
  grammarState.issues = matches.map((match) => {
    const isGrammar =
      match.rule.issueType === "grammar" ||
      match.rule.issueType === "misspelling";

    return {
      id: Math.random().toString(36).substr(2, 9),
      offset: match.offset,
      length: match.length,
      message: match.message,
      replacements: match.replacements.slice(0, 3).map((r) => r.value), // Top 3 suggestions
      context: match.context.text,
      contextOffset: match.context.offset,
      contextLength: match.context.length,
      type: isGrammar ? "grammar" : "recommendation",
    };
  });

  updateTabCounts();
  highlightErrorsInQuill();
  renderIssues();
}

// --- 4. Rendering & Interactions ---

function updateTabCounts() {
  const allCount = grammarState.issues.length;
  const grammarCount = grammarState.issues.filter(
    (i) => i.type === "grammar"
  ).length;
  const recCount = grammarState.issues.filter(
    (i) => i.type === "recommendation"
  ).length;

  const sidebar = document.getElementById("grammar-sidebar");
  sidebar.querySelector('[data-tab="all"]').textContent = `All (${allCount})`;
  sidebar.querySelector(
    '[data-tab="grammar"]'
  ).textContent = `Grammar (${grammarCount})`;
  sidebar.querySelector(
    '[data-tab="recommendation"]'
  ).textContent = `Recs (${recCount})`;
}

function renderIssues() {
  const container = document.getElementById("grammar-results");
  container.innerHTML = "";

  // Filter issues based on tab
  let visibleIssues = grammarState.issues;
  if (grammarState.currentTab === "grammar") {
    visibleIssues = grammarState.issues.filter((i) => i.type === "grammar");
  } else if (grammarState.currentTab === "recommendation") {
    visibleIssues = grammarState.issues.filter(
      (i) => i.type === "recommendation"
    );
  }

  // Header Actions (Accept All)
  if (visibleIssues.length > 0) {
    const actionsBar = document.createElement("div");
    actionsBar.className = "grammar-actions-bar";
    actionsBar.innerHTML = `<button class="accept-all-btn">Accept All</button>`;
    actionsBar
      .querySelector("button")
      .addEventListener("click", () => acceptAll(visibleIssues));
    container.appendChild(actionsBar);
  } else {
    container.innerHTML = `<div class="grammar-loading">No issues found. Great job!</div>`;
    return;
  }

  // Render Cards
  visibleIssues.forEach((issue) => {
    const card = document.createElement("div");
    card.className = `issue-card type-${issue.type}`;

    // Highlight the error in context text
    const contextHtml =
      issue.context.substring(0, issue.contextOffset) +
      `<b>${issue.context.substring(
        issue.contextOffset,
        issue.contextOffset + issue.contextLength
      )}</b>` +
      issue.context.substring(issue.contextOffset + issue.contextLength);

    let buttonsHtml = "";
    issue.replacements.forEach((rep) => {
      buttonsHtml += `<button class="suggestion-btn" data-rep="${rep}">${rep}</button>`;
    });

    card.innerHTML = `
        <div class="issue-message">${issue.message}</div>
        <div class="issue-context">"...${contextHtml}..."</div>
        <div class="issue-actions">
          ${buttonsHtml}
        </div>
      `;

    // Add click events to suggestion buttons
    card.querySelectorAll(".suggestion-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyCorrection(issue, btn.dataset.rep);
      });
    });

    // Scroll to error in editor on card click
    card.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") {
        window.focusedEditor.setSelection(issue.offset, issue.length);
      }
    });

    container.appendChild(card);
  });
}

// --- 5. Quill Modification Logic ---

function highlightErrorsInQuill() {
  const editor = window.focusedEditor;
  if (!editor) return;

  // Clear previous formatting in the whole doc (simple approach)
  // Note: This removes ALL background colors. If you use background colors for other things,
  // you need a specific Blot. For now, we assume simple highlighting.
  editor.formatText(0, editor.getLength(), "background", false);

  // Apply new highlights
  grammarState.issues.forEach((issue) => {
    const color =
      issue.type === "grammar"
        ? "rgba(229, 57, 53, 0.2)"
        : "rgba(30, 136, 229, 0.2)";
    editor.formatText(issue.offset, issue.length, "background", color);
  });
}

function clearHighlights() {
  const editor = window.focusedEditor;
  if (editor) editor.formatText(0, editor.getLength(), "background", false);
}

function applyCorrection(issue, replacementText) {
  const editor = window.focusedEditor;

  // 1. Replace text
  editor.deleteText(issue.offset, issue.length);
  editor.insertText(issue.offset, replacementText);

  // 2. Remove highlighted style from the new text
  editor.formatText(issue.offset, replacementText.length, "background", false);

  // 3. Re-run check
  // Since changing text shifts all subsequent indices, the easiest way
  // to keep state consistent without complex math is to re-run the check.
  // This also validates the new sentence structure.
  runGrammarCheck();
}

function acceptAll(issues) {
  const editor = window.focusedEditor;

  // 1. Sort issues by offset DESCENDING (Back to Front)
  // This prevents index shifting from breaking subsequent replacements
  const sortedIssues = [...issues].sort((a, b) => b.offset - a.offset);

  // 2. Apply all
  sortedIssues.forEach((issue) => {
    if (issue.replacements.length > 0) {
      const bestReplacement = issue.replacements[0];
      editor.deleteText(issue.offset, issue.length);
      editor.insertText(issue.offset, bestReplacement);
      editor.formatText(
        issue.offset,
        bestReplacement.length,
        "background",
        false
      );
    }
  });

  // 3. Re-run to refresh list
  runGrammarCheck();
}
