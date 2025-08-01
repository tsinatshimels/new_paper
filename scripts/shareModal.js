const APP_HIDDEN = "paper--hidden";

const shareBoard = document.getElementById("share_paper--btn");
const shareBoardModal = document.getElementById("shareBoardModal");
const hideShareButton = shareBoardModal.querySelector(".top button");

function showShareModal() {
  shareBoardModal.classList.remove(APP_HIDDEN);
}

function hideShareModal() {
  shareBoardModal.classList.add(APP_HIDDEN);
}

function bindShareEvents() {
  if (shareBoard) {
    shareBoard.addEventListener("click", showShareModal);
  }

  if (hideShareButton) {
    hideShareButton.addEventListener("click", hideShareModal);
  }

  shareBoardModal.addEventListener("click", (e) => {
    if (e.target === shareBoardModal) {
      hideShareModal();
    }
  });
}

// Run after DOM is ready
window.addEventListener("DOMContentLoaded", bindShareEvents);
