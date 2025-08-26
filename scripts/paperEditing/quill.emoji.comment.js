// Your new quill.emoji.comment.js file

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
let comments = {}; // Store all comments { id: { text: '...', range: ... } }
let activeCommentId = null; // The ID of the comment being created
let activeRange = null; // The selection range for the new comment

// --- Main Logic ---

/**
 * Shows a toolbar (either selection or emoji) positioned relative to the selected text.
 * @param {Quill} editor The currently focused Quill instance
 * @param {Element} toolbarEl The toolbar element to show
 */
function showToolbar(editor, toolbarEl) {
  const range = editor.getSelection();
  if (!range || range.length === 0) return;

  const editorContainer = document.getElementById("editor-container");
  const bounds = editor.getBounds(range.index, range.length);

  // Adjust position relative to the main container
  const editorRect = editor.container.getBoundingClientRect();
  const containerRect = editorContainer.getBoundingClientRect();

  toolbarEl.style.top = `${
    editorRect.top - containerRect.top + bounds.top - toolbarEl.offsetHeight - 5
  }px`;
  toolbarEl.style.left = `${
    270 +
    editorRect.left -
    containerRect.left +
    bounds.left +
    bounds.width / 2 -
    toolbarEl.offsetWidth / 2
  }px`;

  toolbarEl.classList.remove("hidden");
}

/**
 * Hides all pop-up toolbars.
 */
function hideAllToolbars() {
  selectionToolbar.classList.add("hidden");
  emojiPicker.classList.add("hidden");
}

/**
 * Attaches selection-related event listeners to a Quill editor instance.
 * This is designed to be called for each editor you create.
 * @param {Quill} editor
 */
window.setupCommentEmojiListeners = function (editor) {
  editor.on("selection-change", function (range, oldRange, source) {
    if (source === "user" && range && range.length > 0) {
      showToolbar(editor, selectionToolbar);
      emojiPicker.classList.add("hidden"); // Hide emoji picker if selecting new text
    } else {
      // Don't hide if the focus is moving to one of our toolbars
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
      // Insert emoji after the selected text
      window.focusedEditor.insertText(
        range.index + range.length,
        emoji,
        "user"
      );
      // Move cursor after the inserted emoji
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
    comments[activeCommentId] = { text: commentText, range: activeRange };
    renderComments();

    // Reset state
    commentInput.value = "";
    commentInputContainer.classList.add("hidden");
    activeCommentId = null;
    activeRange = null;
  }
});

cancelCommentBtn.addEventListener("click", () => {
  if (activeCommentId && activeRange) {
    // Remove the highlight from the text
    window.focusedEditor.formatText(
      activeRange.index,
      activeRange.length,
      "comment",
      false
    );
  }

  // Reset state
  commentInput.value = "";
  commentInputContainer.classList.add("hidden");
  activeCommentId = null;
  activeRange = null;
});

// --- Rendering ---
function renderComments() {
  commentList.innerHTML = "";
  for (const id in comments) {
    const comment = comments[id];
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    commentItem.setAttribute("data-comment-id", id);
    commentItem.textContent = comment.text;
    commentList.appendChild(commentItem);
  }

  // If no comments left, hide the whole sidebar
  if (Object.keys(comments).length === 0) {
    commentSidebar.classList.add("hidden");
  }
}
