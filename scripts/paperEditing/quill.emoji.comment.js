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

// =================================================================
// START OF MODIFIED AREA
// =================================================================

commentList.addEventListener("click", (event) => {
  const commentItem = event.target.closest(".comment-item");
  const replyItem = event.target.closest(".comment-reply-item");

  if (!commentItem && !replyItem) return;

  // Prioritize reply actions if a reply was clicked
  const targetElement = replyItem || commentItem;
  const parentCommentId = commentItem.getAttribute("data-comment-id");
  const replyId = replyItem ? replyItem.getAttribute("data-reply-id") : null;
  const commentId = replyId ? null : parentCommentId; // This is a main comment ONLY if it's not a reply action

  // --- Universal Dropdown Logic (for both comments and replies) ---
  const optionBtn = event.target.closest(".comment-option-btn");
  if (optionBtn) {
    const wasAlreadyOpen = targetElement.querySelector(
      ".comment-options-dropdown"
    );
    // Clean slate: remove ALL open dropdowns first
    document
      .querySelectorAll(".comment-options-dropdown")
      .forEach((d) => d.remove());

    if (!wasAlreadyOpen) {
      const dropdown = document.createElement("div");
      dropdown.className = "comment-options-dropdown";
      // Add data attributes to know what we're editing/deleting
      if (replyId) {
        dropdown.setAttribute("data-parent-id", parentCommentId);
        dropdown.setAttribute("data-reply-id", replyId);
      } else {
        dropdown.setAttribute("data-comment-id", commentId);
      }

      dropdown.innerHTML = `
                <button class="dropdown-btn edit-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M19.09 14.441v4.44a2.37 2.37 0 0 1-2.369 2.369H5.12a2.37 2.37 0 0 1-2.369-2.383V7.279a2.356 2.356 0 0 1 2.37-2.37H9.56"/><path d="M6.835 15.803v-2.165c.002-.357.144-.7.395-.953l9.532-9.532a1.36 1.36 0 0 1 1.934 0l2.151 2.151a1.36 1.36 0 0 1 0 1.934l-9.532 9.532a1.36 1.36 0 0 1-.953.395H8.197a1.36 1.36 0 0 1-1.362-1.362M19.09 8.995l-4.085-4.086"/></g></svg> Edit</button>
                <button class="dropdown-btn add-reaction-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8m-2.5-6.25a1.5 1.5 0 1 1 1.5 1.5a1.5 1.5 0 0 1-1.5-1.5M12 12a1.5 1.5 0 0 0-1.5 1.5v.25a.25.25 0 0 0 .25.25h2.5a.25.25 0 0 0 .25-.25v-.25A1.5 1.5 0 0 0 12 12m2.5-1.5a1.5 1.5 0 1 1 1.5 1.5a1.5 1.5 0 0 1-1.5-1.5"/></svg> Add Reaction</button>
                <button class="dropdown-btn delete-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#f20f0f" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="24" stroke-dashoffset="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M4 5h16"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="20;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M10 4h4M10 9v7M14 9v7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg> Delete</button>
            `;
      // For main comments, add the Reply and Resolve options
      if (!replyId) {
        const replyBtn = document.createElement("button");
        replyBtn.className = "dropdown-btn reply-btn-dropdown";
        replyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#000" d="M19 19v-4q0-1.25-.875-2.125T16 12H6.825l3.6 3.6L9 17l-6-6l6-6l1.425 1.4l-3.6 3.6H16q2.075 0 3.538 1.463T21 15v4z"/></svg> Reply`;
        dropdown.prepend(replyBtn); // Add to the top
        replyBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          document.querySelector(".comment-options-dropdown").remove(); // This closes the dropdown
          showReplyInput(commentId, commentItem);
        });
      }

      targetElement.appendChild(dropdown);
    }
    return; // Stop other events
  }

  // --- Delegated Action Handlers ---

  // Handle Add Reaction
  const addReactionBtn = event.target.closest(".add-reaction-btn");
  if (addReactionBtn) {
    const dropdown = addReactionBtn.closest(".comment-options-dropdown");
    if (dropdown) {
      // The container for the button is the .comment-actions div
      const actionsContainer = dropdown.parentElement;
      showReactionPicker(actionsContainer, parentCommentId, replyId);
      dropdown.remove(); // Close the original dropdown
      console.log("[LOG] Add Reaction button clicked.");
    }
    return; // Stop processing
  }

  // Handle Delete
  const deleteBtn = event.target.closest(".delete-btn");
  if (deleteBtn) {
    if (replyId) {
      deleteReply(parentCommentId, replyId);
    } else {
      deleteComment(parentCommentId);
    }
    deleteBtn.parentElement.remove(); // Close dropdown
  }

  // Handle Edit (Placeholder for now)
  const editBtn = event.target.closest(".edit-btn");
  if (editBtn) {
    console.log(
      "[LOG] Edit button clicked. Edit functionality not implemented yet."
    );

    editBtn.parentElement.remove();
  }

  const resolveBtn = event.target.closest(".resolve-comment-btn");
  if (resolveBtn) {
    resolveComment(parentCommentId);
  }

  // Highlight on click (only for main comments)
  if (commentId) {
    highlightCommentText(commentId);
  }
});

// New function to show a small emoji picker for reactions
function showReactionPicker(container, parentId, replyId) {
  // container is now the element with the .comment-actions div
  // document.querySelectorAll(".reaction-picker").forEach((p) => p.remove());

  const picker = document.createElement("div");
  picker.className = " reaction-picker";
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉"];
  reactions.forEach((emoji) => {
    const btn = document.createElement("button");
    btn.className = "dropdown-btn";
    btn.textContent = emoji;
    btn.onclick = () => {
      addReaction(parentId, replyId, emoji);
      // picker.remove();
    };
    picker.appendChild(btn);
  });

  // Append the picker inside the .comment-actions div.
  // This makes the new CSS positioning work perfectly.
  container.appendChild(picker);
}

// New function to add a reaction to a comment or reply
function addReaction(parentId, replyId, emoji) {
  if (replyId) {
    // It's a reply
    const parentComment = comments[parentId];
    const reply = parentComment?.replies.find((r) => r.id === replyId);
    if (reply) {
      reply.text += ` ${emoji}`;
    }
  } else {
    // It's a main comment
    const comment = comments[parentId];
    if (comment) {
      comment.text += ` ${emoji}`;
    }
  }
  renderComments();
}

// New function to delete a reply
function deleteReply(parentId, replyId) {
  const parentComment = comments[parentId];
  if (parentComment && parentComment.replies) {
    parentComment.replies = parentComment.replies.filter(
      (r) => r.id !== replyId
    );
    renderComments();
  }
}

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
      repliesHTML = '<div class="comment-replies-container">';
      comment.replies.forEach((reply) => {
        const replyTimestamp = formatTimestamp(reply.createdAt);
        // MODIFICATION: Added data-reply-id and the options button for each reply
        repliesHTML += `
                <div class="comment-reply-item" data-reply-id="${reply.id}">
                    <div class="comment-header">
                        <div class="comment-profile-icon reply-icon"><img src="https://randomuser.me/api/portraits/med/men/94.jpg" alt="User"></div>
                        <div style="display: flex; flex-direction: column;">
                            <div class="comment-author">${reply.author}</div>
                            <div class="comment-timestamp">${replyTimestamp}</div>
                        </div>
                         <div class="comment-actions">
                            <button class="comment-option-btn" title="Options">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#8837e9" d="M7 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="comment-text">${reply.text}</div>
                </div>
            `;
      });
      repliesHTML += "</div>";
    }

    commentItem.innerHTML = `
            <div class="comment-header">
                <div class="comment-profile-icon"><img src="https://randomuser.me/api/portraits/med/men/94.jpg" alt="Louis Davies"></div>
                <div style="display: flex; flex-direction: column;">
                <div class="comment-author">${comment.author}</div>
                <div class="comment-timestamp">${timestamp}</div>
                </div>
                 <div class="comment-actions">
                     <button class="comment-action-btn resolve-comment-btn" title="Resolve">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="green" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
                    </button>
                    <button class="comment-option-btn" title="Options">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#8837e9" d="M7 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"/></svg>
                    </button>
                </div>
            </div>
            ${commentContentHTML}
            ${repliesHTML}
         
        `;
    commentList.appendChild(commentItem);

    commentItem.addEventListener("mouseover", () => highlightCommentText(id));
    commentItem.addEventListener("mouseout", () => {
      document.querySelectorAll(".comment-highlight-active").forEach((el) => {
        el.classList.remove("comment-highlight-active");
      });
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
  const resolved = Object.entries(comments).filter(([id, c]) => c.resolved);
  if (resolved.length === 0) {
    resolvedList.innerHTML = "<p>No resolved comments.</p>";
    return;
  }
  resolved.forEach(([id, comment]) => {
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item resolved-item"; // Keep .comment-item class for hover styles
    commentItem.setAttribute("data-comment-id", id);
    const createdAt = formatTimestamp(comment.createdAt);
    const resolvedAt = formatTimestamp(comment.resolvedAt);
    commentItem.innerHTML = `
          <div class="comment-header">
            <div class="comment-profile-icon"><img src="https://randomuser.me/api/portraits/med/men/94.jpg" alt="User"></div>
            <div class="comment-author">${comment.author}</div>
            <!-- MODIFICATION: Added actions menu for resolved comments -->
            <div class="comment-actions">
                <button class="comment-option-btn delete-resolved-btn" title="Delete Permanently">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#f20f0f" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 5h16M7 5v-2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2M10 9v7M14 9v7M5 5l1 15a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-15"/></g></svg>
                </button>
            </div>
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

// Add a separate listener for the resolved comments modal for deletion
document.addEventListener("DOMContentLoaded", () => {
  const resolvedList = document.getElementById("resolved-comment-list");
  if (resolvedList) {
    resolvedList.addEventListener("click", (event) => {
      const deleteBtn = event.target.closest(".delete-resolved-btn");
      if (deleteBtn) {
        const commentItem = event.target.closest(".comment-item");
        const commentId = commentItem.getAttribute("data-comment-id");
        if (commentId) {
          delete comments[commentId]; // Delete from master list
          renderResolvedComments(); // Re-render the modal
        }
      }
    });
  }
});
