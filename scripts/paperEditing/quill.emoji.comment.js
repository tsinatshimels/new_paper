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
  const rightPosition =
    editorRect.left -
    wrapperRect.left +
    bounds.left +
    bounds.width / 2 -
    toolbarEl.offsetWidth / 2;
  toolbarEl.style.top = `${topPosition}px`;
  toolbarEl.style.right = `${rightPosition}px`;
  toolbarEl.classList.remove("hidden");
}

function hideAllToolbars() {
  selectionToolbar.classList.add("hidden");
  emojiPicker.classList.add("hidden");
}

window.setupCommentEmojiListeners = function (editor) {
  editor.on("selection-change", function (range, oldRange, source) {
    if (source === "user" && range && range.length > 0) {
      activeRange = range;
      showToolbar(editor, selectionToolbar);
      emojiPicker.classList.add("hidden");
    } else if (source === "user" && range && range.length === 0) {
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
  if (!window.focusedEditor || !activeRange) return;
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
    if (!window.focusedEditor || !activeRange) return;
    const emoji = event.target.textContent;
    const commentId = `emoji-${Date.now()}`;
    const randomAuthor =
      mockUsers[Math.floor(Math.random() * mockUsers.length)];

    window.focusedEditor.formatText(
      activeRange.index,
      activeRange.length,
      "comment",
      commentId
    );

    comments[commentId] = {
      text: emoji,
      range: activeRange,
      author: randomAuthor,
      resolved: false,
      type: "emoji",
      createdAt: new Date().toISOString(),
      replies: [], // For reply functionality
    };

    renderComments();
    hideAllToolbars();
    activeRange = null;
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
      type: "comment",
      createdAt: new Date().toISOString(),
      replies: [], // For reply functionality
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

// =================================================================
// START OF DEBUGGING AREA
// =================================================================

commentList.addEventListener("click", (event) => {
  const commentItem = event.target.closest(".comment-item");
  if (!commentItem) return;

  const commentId = commentItem.getAttribute("data-comment-id");

  // --- Dropdown Logic (Now with Toggle and smarter closing) ---
  const optionBtn = event.target.closest(".comment-option-btn");
  if (optionBtn) {
    // Check if a dropdown for THIS comment was already open
    const wasAlreadyOpen = commentItem.querySelector(
      ".comment-options-dropdown"
    );

    // First, for a clean slate, remove ALL open dropdowns
    document
      .querySelectorAll(".comment-options-dropdown")
      .forEach((d) => d.remove());

    // If the one we clicked wasn't already open, then it's time to create it.
    // If it was open, the line above already closed it, creating the toggle effect.
    if (!wasAlreadyOpen) {
      const dropdown = document.createElement("div");
      dropdown.className = "comment-options-dropdown";
      dropdown.innerHTML = `
                <button class="dropdown-btn reply-btn-dropdown"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#000" d="M19 19v-4q0-1.25-.875-2.125T16 12H6.825l3.6 3.6L9 17l-6-6l6-6l1.425 1.4l-3.6 3.6H16q2.075 0 3.538 1.463T21 15v4z"/></svg> Reply</button>
                <button class="dropdown-btn edit-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M19.09 14.441v4.44a2.37 2.37 0 0 1-2.369 2.369H5.12a2.37 2.37 0 0 1-2.369-2.383V7.279a2.356 2.356 0 0 1 2.37-2.37H9.56"/><path d="M6.835 15.803v-2.165c.002-.357.144-.7.395-.953l9.532-9.532a1.36 1.36 0 0 1 1.934 0l2.151 2.151a1.36 1.36 0 0 1 0 1.934l-9.532 9.532a1.36 1.36 0 0 1-.953.395H8.197a1.36 1.36 0 0 1-1.362-1.362M19.09 8.995l-4.085-4.086"/></g></svg> Edit</button>
                <button class="dropdown-btn delete-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#f20f0f" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg> Delete</button>
            `;
      commentItem.appendChild(dropdown);
      dropdown
        .querySelector(".delete-btn")
        .addEventListener("click", () => deleteComment(commentId));
      dropdown
        .querySelector(".reply-btn-dropdown")
        .addEventListener("click", () => {
          // First, show the reply input
          showReplyInput(commentId, commentItem);
          // Then, immediately remove the dropdown menu
          dropdown.classList.add("hidden");
        });
    }
    return; // Stop other click events from firing
  }

  // --- Reply Logic ---
  const replyBtn = event.target.closest(".comment-reply-btn");
  if (replyBtn) {
    showReplyInput(commentId, commentItem);
    // close the dropdown if open
    const dropdown = commentItem.querySelector(".comment-options-dropdown");
    if (dropdown) dropdown.remove();
  }

  // --- Resolve Logic ---
  const resolveBtn = event.target.closest(".resolve-comment-btn");
  if (resolveBtn) {
    resolveComment(commentId);
  }

  // Highlight on click
  highlightCommentText(commentId);
});

document.addEventListener("click", function (event) {
  if (!event.target.closest(".comment-item")) {
    document
      .querySelectorAll(".comment-options-dropdown")
      .forEach((d) => d.remove());
  }
  // Check if the click is outside BOTH the comment item and the reply container
  if (
    !event.target.closest(".comment-item") &&
    !event.target.closest(".reply-container")
  ) {
    document.querySelectorAll(".reply-container").forEach((rc) => rc.remove());
  }
});

function showReplyInput(commentId, commentItemEl) {
  console.log(`[LOG] showReplyInput() called for commentId: ${commentId}`);

  // Remove any other open reply boxes
  document.querySelectorAll(".reply-container").forEach((rc) => rc.remove());

  const replyContainer = document.createElement("div");
  replyContainer.className = "reply-container";
  replyContainer.innerHTML = `
        <textarea class="reply-input" placeholder="Write a reply..."></textarea>
        <div class="reply-buttons">
            <button class="save-reply-btn">Reply</button>
            <button class="cancel-reply-btn">Cancel</button>
        </div>
    `;

  commentItemEl.appendChild(replyContainer);
  console.log("[LOG] Reply input box created and appended.", replyContainer);
  replyContainer.querySelector(".reply-input").focus();

  replyContainer
    .querySelector(".cancel-reply-btn")
    .addEventListener("click", () => {
      console.log("[LOG] Cancel reply clicked.");
      replyContainer.remove();
    });

  replyContainer
    .querySelector(".save-reply-btn")
    .addEventListener("click", () => {
      console.log("[LOG] Save reply button clicked.");
      const replyText = replyContainer
        .querySelector(".reply-input")
        .value.trim();
      if (replyText) {
        saveReply(commentId, replyText);
        replyContainer.remove();
      } else {
        console.warn("[LOG] Save reply clicked, but text was empty.");
      }
    });
}

function saveReply(parentId, text) {
  console.log(
    `[LOG] saveReply() called. ParentID: ${parentId}, Text: "${text}"`
  );

  // Log the state of the parent comment BEFORE making changes
  console.log(
    "[LOG] Parent comment object (before adding reply):",
    JSON.parse(JSON.stringify(comments[parentId]))
  );

  if (!comments[parentId]) {
    console.error(
      `[FATAL] Could not find parent comment with ID: ${parentId}. Aborting save.`
    );
    return;
  }
  // Defensive check: if replies array doesn't exist, create it.
  if (!comments[parentId].replies) {
    console.warn(
      `[WARN] Parent comment ${parentId} was missing a 'replies' array. Creating one now.`
    );
    comments[parentId].replies = [];
  }

  const randomAuthor = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const reply = {
    id: `reply-${Date.now()}`,
    author: randomAuthor,
    text: text,
    createdAt: new Date().toISOString(),
  };

  console.log("[LOG] Created new reply object:", reply);

  comments[parentId].replies.push(reply);
  console.log(
    "[LOG] Parent comment object (after adding reply):",
    JSON.parse(JSON.stringify(comments[parentId]))
  );

  console.log("[LOG] Calling renderComments() to update the UI...");
  renderComments(); // Re-render to show the new reply
}

// --- Highlighting Logic ---
function highlightCommentText(commentId) {
  document.querySelectorAll(".comment-highlight-active").forEach((el) => {
    el.classList.remove("comment-highlight-active");
  });
  const activeHighlights = document.querySelectorAll(
    `.comment-highlight[data-comment-id="${commentId}"]`
  );
  activeHighlights.forEach((el) =>
    el.classList.add("comment-highlight-active")
  );
}

function deleteComment(id) {
  if (!comments[id]) return;
  const { range } = comments[id];
  window.focusedEditor.formatText(range.index, range.length, "comment", false);
  delete comments[id];
  renderComments();
  renderResolvedComments();
}

function resolveComment(id) {
  if (!comments[id]) return;
  const commentItem = commentList.querySelector(`[data-comment-id="${id}"]`);
  if (commentItem) {
    commentItem.classList.add("resolving");
    setTimeout(() => {
      comments[id].resolved = true;
      comments[id].resolvedAt = new Date().toISOString();
      const { range } = comments[id];
      window.focusedEditor.formatText(
        range.index,
        range.length,
        "comment",
        false
      );
      renderComments();
      renderResolvedComments();
    }, 300);
  }
}

// --- Utility Functions ---
function formatTimestamp(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// --- Rendering ---
function renderComments() {
  console.log(
    "[LOG] renderComments() called. Current state of all comments:",
    JSON.parse(JSON.stringify(comments))
  );
  commentList.innerHTML = "";
  const activeComments = Object.entries(comments).filter(
    ([id, comment]) => !comment.resolved
  );

  activeComments.forEach(([id, comment]) => {
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    commentItem.setAttribute("data-comment-id", id);
    const timestamp = formatTimestamp(comment.createdAt);

    let commentContentHTML =
      comment.type === "emoji"
        ? `<div class="comment-text emoji-reaction">${comment.text}</div>`
        : `<div class="comment-text">${comment.text}</div>`;

    let repliesHTML = "";
    if (comment.replies && comment.replies.length > 0) {
      console.log(
        `[LOG] Rendering ${comment.replies.length} replies for comment ${id}`
      );
      repliesHTML = '<div class="comment-replies-container">';
      comment.replies.forEach((reply) => {
        const replyTimestamp = formatTimestamp(reply.createdAt);
        repliesHTML += `
                <div class="comment-reply-item">
                    <div class="comment-header">
                        <div class="comment-profile-icon reply-icon"><img src="https://randomuser.me/api/portraits/med/men/94.jpg" alt="User"></div>
                        <div style="display: flex; flex-direction: column;">
                        <div class="comment-author">${reply.author}</div>
                        <div class="comment-timestamp">${replyTimestamp}</div>
                        </div>
                    </div>
                    <div class="comment-text">${reply.text}</div>
                </div>
            `;
      });
      repliesHTML += "</div>";
    }

    commentItem.innerHTML =
      `
            <div class="comment-header">
                <div class="comment-profile-icon"><img src="https://randomuser.me/api/portraits/med/men/94.jpg" alt="Louis Davies"></div>
                <div style="display: flex; flex-direction: column;">
                <div class="comment-author">${comment.author}</div>
                <div class="comment-timestamp">${timestamp}</div>
                </div>
            </div>
            ${commentContentHTML}
            ${repliesHTML}
            <div class="comment-footer">
                
                <div class="comment-actions">
                    <button class="comment-action-btn resolve-comment-btn" title="Resolve">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" ` +
      `24"><path fill="green" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
                    </button>
                    <button class="comment-option-btn" title="Options">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 ` +
      `24"><rect width="24" height="24" fill="none"/><path fill="#8837e9" d="M7 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"/></svg>
                    </button>
                </div>
            </div>
        `;
    commentList.appendChild(commentItem);

    commentItem.addEventListener("mouseover", () => highlightCommentText(id));
    commentItem.addEventListener("mouseout", () => {
      document.querySelectorAll(".comment-highlight-active").forEach((el) => {
        el.classList.remove("comment-highlight-active");
      });
    });

    commentItem.addEventListener("mouseleave", () => {
      const dropdown = commentItem.querySelector(".comment-options-dropdown");
      if (dropdown) {
        dropdown.remove();
      }
    });
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
    commentItem.className = "comment-item resolved-item";
    const createdAt = formatTimestamp(comment.createdAt);
    const resolvedAt = formatTimestamp(comment.resolvedAt);
    commentItem.innerHTML = `
          <div class="comment-header">
            <div class="comment-profile-icon"><img src="https://randomuser.me/api/portraits/med/men/94.jpg" alt="User"></div>
            <div class="comment-author">${comment.author}</div>
          </div>
          <div class="comment-text">${
            comment.type === "emoji" ? `Reacted: ${comment.text}` : comment.text
          }</div>
          <div class="resolved-timestamp">
             <span>${createdAt} - ${resolvedAt}</span>
          </div>
        `;
    resolvedList.appendChild(commentItem);
  });
}
