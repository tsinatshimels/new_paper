// quill.image-logic.js (New File)

document.addEventListener("DOMContentLoaded", () => {
  // This function will be called for each editor instance
  const attachImageLogic = (editor) => {
    const editorRoot = editor.root;
    let currentBlot = null;
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    // --- SELECTION LOGIC ---
    editor.on("selection-change", (range, oldRange, source) => {
      if (range && range.length === 1) {
        const [blot, offset] = editor.getLeaf(range.index);
        if (blot instanceof Quill.import("signature-image")) {
          // Deselect others and select this one
          editorRoot
            .querySelectorAll(".ql-signature-container.selected")
            .forEach((el) => el.classList.remove("selected"));
          blot.domNode.classList.add("selected");
          currentBlot = blot;
          return;
        }
      }
      // If selection is not on a signature, deselect all
      editorRoot
        .querySelectorAll(".ql-signature-container.selected")
        .forEach((el) => el.classList.remove("selected"));
      currentBlot = null;
    });

    // --- TOOLTIP ACTION LOGIC ---
    editorRoot.addEventListener("click", (e) => {
      if (e.target.closest(".img-delete")) {
        if (currentBlot) {
          const blotIndex = editor.getIndex(currentBlot);
          editor.deleteText(blotIndex, 1, "user");
        }
      } else if (e.target.closest(".img-rotate")) {
        if (currentBlot) {
          const image = currentBlot.domNode.querySelector("img");
          const currentRotation = image.style.transform
            ? parseInt(image.style.transform.replace(/[^0-9-]/g, ""))
            : 0;
          const newRotation = (currentRotation + 90) % 360;
          image.style.transform = `rotate(${newRotation}deg)`;
        }
      }
    });

    // --- RESIZE LOGIC ---
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;
      if (newWidth > 50) {
        // Minimum width
        currentBlot.domNode.querySelector("img").style.width = `${newWidth}px`;
      }
    };

    const handleMouseUp = () => {
      isResizing = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    editorRoot.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("resize-handle-br")) {
        e.preventDefault();
        isResizing = true;
        const image = currentBlot.domNode.querySelector("img");
        startX = e.clientX;
        startWidth = image.offsetWidth;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    });
  };

  // Attach the logic to all existing and future editors
  if (window.paperEditors && window.paperEditors.length > 0) {
    window.paperEditors.forEach(attachImageLogic);
  } else {
    // If editors are not ready, wait for them
    // This part depends on your project's initialization order.
    // For now, we assume paperEditors array is populated.
  }
});
