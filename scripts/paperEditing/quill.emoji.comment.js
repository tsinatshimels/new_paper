// Your corrected quill.emoji.comment.js file

// --- Element References ---
const selectionToolbar = document.getElementById("selection-toolbar");
const addCommentBtn = document.getElementById("add-comment-btn");
const addEmojiBtn = document.getElementById("add-emoji-btn");
const emojiPicker = document.getElementById("emoji-picker");
const commentSidebar = document.getElementById("comment-sidebar");
const commentList = document.getElementById("comment-list");
const commentInputContainer = document.getElementById(
  "comment-input-container"
);
const commentInput = document.getElementById("comment-input");
const saveCommentBtn = document.getElementById("save-comment-btn");
const cancelCommentBtn = document.getElementById("cancel-comment-btn");

// --- State Management ---
let comments = {};
let activeCommentId = null;
let activeRange = null;
const mockUsers = ["Alex Doe", "Jane Smith", "Sam Wilson"];

// --- Main Logic ---
function showToolbar(editor, toolbarEl) {
  const range = editor.getSelection();
  if (!range || range.length === 0) return;
  const editorPaperWrapper = document.getElementById("editor_paper--wrapper");
  if (!editorPaperWrapper) {
    console.error("#editor_paper--wrapper not found!");
    return;
  }
  const bounds = editor.getBounds(range.index, range.length);
  const editorRect = editor.container.getBoundingClientRect();
  const wrapperRect = editorPaperWrapper.getBoundingClientRect();
  const topPosition =
    editorRect.top - wrapperRect.top + bounds.top - toolbarEl.offsetHeight - 5;
  const leftPosition =
    editorRect.left -
    wrapperRect.left +
    bounds.left +
    bounds.width / 2 -
    toolbarEl.offsetWidth / 2;
  toolbarEl.style.top = `${topPosition}px`;
  toolbarEl.style.right = `${leftPosition}px`; // Corrected from .right
  toolbarEl.classList.remove("hidden");
}

function hideAllToolbars() {
  selectionToolbar.classList.add("hidden");
  emojiPicker.classList.add("hidden");
}

window.setupCommentEmojiListeners = function (editor) {
  editor.on("selection-change", function (range, oldRange, source) {
    if (source === "user" && range && range.length > 0) {
      showToolbar(editor, selectionToolbar);
      emojiPicker.classList.add("hidden");
    } else {
      setTimeout(() => {
        if (
          !selectionToolbar.contains(document.activeElement) &&
          !emojiPicker.contains(document.activeElement) &&
          !commentSidebar.contains(document.activeElement)
        ) {
          hideAllToolbars();
        }
      }, 100);
    }
  });
};

// --- Event Handlers ---
addCommentBtn.addEventListener("click", () => {
  if (!window.focusedEditor) return;
  activeRange = window.focusedEditor.getSelection();
  if (!activeRange) return;
  hideAllToolbars();
  activeCommentId = `comment-${Date.now()}`;
  window.focusedEditor.formatText(
    activeRange.index,
    activeRange.length,
    "comment",
    activeCommentId
  );
  commentSidebar.classList.remove("hidden");
  commentInputContainer.classList.remove("hidden");
  commentInput.focus();
});

addEmojiBtn.addEventListener("click", () => {
  if (!window.focusedEditor) return;
  showToolbar(window.focusedEditor, emojiPicker);
  selectionToolbar.classList.add("hidden");
});

emojiPicker.addEventListener("click", (event) => {
  if (event.target.classList.contains("emoji-option")) {
    if (!window.focusedEditor) return;
    const emoji = event.target.textContent;
    const range = window.focusedEditor.getSelection();
    if (range) {
      window.focusedEditor.insertText(
        range.index + range.length,
        emoji,
        "user"
      );
      window.focusedEditor.setSelection(
        range.index + range.length + emoji.length
      );
    }
    hideAllToolbars();
  }
});

saveCommentBtn.addEventListener("click", () => {
  const commentText = commentInput.value.trim();
  if (commentText && activeCommentId) {
    const randomAuthor =
      mockUsers[Math.floor(Math.random() * mockUsers.length)];
    comments[activeCommentId] = {
      text: commentText,
      range: activeRange,
      author: randomAuthor,
      resolved: false,
    };
    renderComments();
    commentInput.value = "";
    commentInputContainer.classList.add("hidden");
    activeCommentId = null;
    activeRange = null;
  }
});

cancelCommentBtn.addEventListener("click", () => {
  if (activeCommentId && activeRange) {
    window.focusedEditor.formatText(
      activeRange.index,
      activeRange.length,
      "comment",
      false
    );
  }
  commentInput.value = "";
  commentInputContainer.classList.add("hidden");
  activeCommentId = null;
  activeRange = null;
});

commentList.addEventListener("click", (event) => {
  const resolveBtn = event.target.closest(".resolve-comment-btn");
  if (resolveBtn) {
    const commentItem = resolveBtn.closest(".comment-item");
    const commentId = commentItem.getAttribute("data-comment-id");
    resolveComment(commentId);
  }
});

function resolveComment(id) {
  if (!comments[id]) return;
  const commentItem = commentList.querySelector(`[data-comment-id="${id}"]`);
  if (commentItem) {
    commentItem.classList.add("resolving");
    setTimeout(() => {
      comments[id].resolved = true;
      renderComments();
      renderResolvedComments(); // <<< THE FIX IS HERE
    }, 300);
  }
}

// --- Rendering ---
function renderComments() {
  commentList.innerHTML = "";
  const activeComments = Object.entries(comments).filter(
    ([id, comment]) => !comment.resolved
  );

  activeComments.forEach(([id, comment]) => {
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    commentItem.setAttribute("data-comment-id", id);
    commentItem.innerHTML = `
      <div class="comment-header">
          <div class="comment-profile-icon">${comment.author.charAt(0)}</div>
          <div class="comment-author">${comment.author}</div>
      </div>
      <div class="comment-text">${comment.text}</div>
      <div class="comment-actions">
          <button class="comment-action-btn resolve-comment-btn" title="Resolve comment">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="green" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
          </button>
      </div>
    `;
    commentList.appendChild(commentItem);
  });

  if (activeComments.length === 0) {
    commentSidebar.classList.add("hidden");
  } else {
    commentSidebar.classList.remove("hidden");
  }
}

function renderResolvedComments() {
  const resolvedList = document.getElementById("resolved-comment-list");
  if (!resolvedList) return;

  resolvedList.innerHTML = "";
  const resolved = Object.values(comments).filter((c) => c.resolved);

  if (resolved.length === 0) {
    resolvedList.innerHTML = "<p>No resolved comments.</p>";
    return;
  }

  resolved.forEach((comment) => {
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    commentItem.innerHTML = `
      <div class="comment-header">
        <div class="comment-profile-icon">${comment.author.charAt(0)}</div>
        <div class="comment-author">${comment.author}</div>
      </div>
      <div class="comment-text">${comment.text}</div>
    `;
    resolvedList.appendChild(commentItem);
  });
}
