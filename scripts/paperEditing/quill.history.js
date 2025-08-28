// --- State ---
let versionHistory = [];

// MAKE THIS FUNCTION GLOBAL so quill.init.js can find it
window.setupHistory = function (editor) {
  // Save initial state
  saveVersion(editor);

  let debounceTimer;
  editor.on("text-change", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => saveVersion(editor), 10000); // 10 seconds
  });
};

function saveVersion(editor) {
  if (!editor) return;
  const content = editor.getContents();
  const text = editor.getText(0, 100);

  if (
    versionHistory.length > 0 &&
    JSON.stringify(versionHistory[versionHistory.length - 1].content) ===
      JSON.stringify(content)
  ) {
    return;
  }

  versionHistory.push({
    timestamp: new Date(),
    content: content,
    preview: text.substring(0, 50) + "...",
  });
}

// MAKE THIS FUNCTION GLOBAL so aside.slider.js can call it
function renderHistory() {
  const historyList = document.getElementById("history-list");
  if (!historyList) return; // Safety check

  historyList.innerHTML = "";
  [...versionHistory].reverse().forEach((version, index) => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.dataset.versionIndex = versionHistory.length - 1 - index;
    item.innerHTML = `
        <div class="history-timestamp">${version.timestamp.toLocaleString()}</div>
        <div class="history-preview">${version.preview}</div>
    `;
    historyList.appendChild(item);
  });
}

// Attach the click listener to the parent container once
const historyListContainer = document.getElementById("history-list");
if (historyListContainer) {
  historyListContainer.addEventListener("click", (event) => {
    const item = event.target.closest(".history-item");
    if (item && window.focusedEditor) {
      const versionIndex = parseInt(item.dataset.versionIndex, 10);
      const selectedVersion = versionHistory[versionIndex];
      if (selectedVersion) {
        window.focusedEditor.setContents(selectedVersion.content);
        // Close the panel for better UX
        document.getElementById("close-history-panel-btn").click();
      }
    }
  });
}
