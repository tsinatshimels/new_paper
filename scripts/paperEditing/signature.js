// signature.js - CLEANED UP VERSION
document.addEventListener("DOMContentLoaded", function () {
  const signatureModal = document.getElementById("signature-modal");
  const signatureButton = document.getElementById("Signature");
  const closeButton = signatureModal.querySelector(".close-button");

  const canvas = document.getElementById("signature-canvas");
  const ctx = canvas.getContext("2d");
  const thicknessSlider = document.getElementById("thickness");
  const colorPicker = document.getElementById("color");
  const addSignatureBtn = document.getElementById("add-signature-btn");
  const clearCanvasBtn = document.getElementById("clear-canvas-btn");
  const signatureGallery = document.querySelector(".signature-gallery");
  const noSignatureMessage = document.querySelector(".no-signature-message");
  const clickInsert = document.querySelector(".click-to-insert");

  let drawing = false;
  let signatures = [];
  let signatureCount = 0; // Keep this in signature.js only

  // --- Modal Toggle Logic ---
  signatureButton.addEventListener("click", () => {
    signatureModal.classList.add("open");
    closeDropdownBar(); // close all dropdown
  });
  closeButton.addEventListener("click", () =>
    signatureModal.classList.remove("open")
  );

  function closeDropdownBar() {
    const dropdowns = document.querySelectorAll(
      ".toolbar_headers--holder ul#dropdown"
    );
    //   make the aria-expanded false for all dropdowns
    dropdowns.forEach((dropdown) => {
      dropdown.style.display = "none";
      dropdown.previousElementSibling.setAttribute("aria-expanded", "false");
    });
  }

  // --- Canvas Drawing Logic ---
  const startDrawing = (e) => {
    drawing = true;
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!drawing) return;
    ctx.lineWidth = thicknessSlider.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = colorPicker.value;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    drawing = false;
    ctx.closePath();
  };

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearCanvasBtn.addEventListener("click", clearCanvas);
  // Function to calculate the bounding box of drawn content (keep this as provided before)
  function getBoundingBox(canvas, ctx) {
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h).data;

    let minX = w,
      maxX = 0,
      minY = h,
      maxY = 0;
    let found = false;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const alphaIndex = (y * w + x) * 4 + 3;
        if (imageData[alphaIndex] > 0) {
          found = true;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (!found) return null;

    const padding = 5;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(w, maxX + padding);
    maxY = Math.min(h, maxY + padding);

    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;

    return { x: minX, y: minY, w: boxWidth, h: boxHeight };
  }

  // *** NEW FUNCTION: Handles asynchronous cropping of a stored image URL ***
  function getCroppedDataUrl(originalDataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // 1. Draw the stored image onto a temp canvas
        const boxCanvas = document.createElement("canvas");
        boxCanvas.width = img.width;
        boxCanvas.height = img.height;
        const boxCtx = boxCanvas.getContext("2d");
        boxCtx.drawImage(img, 0, 0);

        // 2. Get the bounding box
        const box = getBoundingBox(boxCanvas, boxCtx);

        if (box && box.w > 0 && box.h > 0) {
          // 3. Create a final cropped canvas
          const finalCanvas = document.createElement("canvas");
          const finalCtx = finalCanvas.getContext("2d");
          finalCanvas.width = box.w;
          finalCanvas.height = box.h;

          // 4. Draw the cropped section onto the final canvas
          finalCtx.drawImage(
            boxCanvas,
            box.x,
            box.y,
            box.w,
            box.h, // Source: the full drawn image
            0,
            0,
            box.w,
            box.h // Destination: the new small canvas
          );
          resolve(finalCanvas.toDataURL());
        } else {
          // Fallback: return original if cropping failed
          resolve(originalDataUrl);
        }
      };
      img.src = originalDataUrl;
    });
  }

  // --- Signature Management ---
  addSignatureBtn.addEventListener("click", () => {
    if (isCanvasBlank()) return;
    const dataUrl = canvas.toDataURL();
    signatures.push({ id: Date.now(), url: dataUrl });
    renderSignatures();
    clearCanvas();
    document.querySelector('.tab-link[onclick*="Sign"]').click();
  });

  function isCanvasBlank() {
    const blank = document.createElement("canvas");
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
  }

  function renderSignatures() {
    signatureGallery.innerHTML = "";
    noSignatureMessage.style.display = signatures.length > 0 ? "none" : "block";
    clickInsert.style.display = signatures.length > 0 ? "flex" : "none";

    signatures.forEach((sig) => {
      const sigItem = document.createElement("div");
      sigItem.classList.add("signature-item");
      sigItem.dataset.id = sig.id;

      const img = document.createElement("img");
      img.src = sig.url;

      const menuBtn = document.createElement("button");
      menuBtn.classList.add("signature-menu-btn");
      menuBtn.innerHTML = `&#8942;`;

      sigItem.appendChild(img);
      sigItem.appendChild(menuBtn);

      sigItem.addEventListener("click", (e) => {
        e.stopPropagation();
        document
          .querySelectorAll(".signature-item.selected")
          .forEach((item) => item.classList.remove("selected"));
        sigItem.classList.add("selected");
      });

      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showSignatureDropdown(e.currentTarget, sig.id);
      });
      signatureGallery.appendChild(sigItem);
    });
  }

  function showSignatureDropdown(button, signatureId) {
    closeAllDropdowns();
    const signature = signatures.find((s) => s.id === signatureId);
    const rect = button.getBoundingClientRect();
    const menu = document.createElement("ul");
    menu.className = "signature-dropdown";

    const options = [
      { text: "Insert Signature", action: () => insertSignature(signatureId) },
      { text: "Edit Signature", action: () => editSignature(signatureId) },
      { text: "Delete Signature", action: () => deleteSignature(signatureId) },
    ];

    options.forEach((opt) => {
      const li = document.createElement("li");
      li.textContent = opt.text;
      li.onclick = (e) => {
        e.stopPropagation();
        opt.action();
        closeAllDropdowns();
      };
      menu.appendChild(li);
    });
    // append on that specific signature item

    button.parentElement.appendChild(menu);
  }

  function closeAllDropdowns() {
    document
      .querySelectorAll(".signature-dropdown")
      .forEach((menu) => menu.remove());
    document
      .querySelectorAll(".signature-item.selected")
      .forEach((item) => item.classList.remove("selected"));
  }

  document.addEventListener("click", closeAllDropdowns);

  // ===== UPDATED INSERT FUNCTION - USING CUSTOM BLOT ONLY =====
  function insertSignature(id) {
    const signature = signatures.find((s) => s.id === id);
    if (!signature || !window.focusedEditor) return;

    // 1. Get the original URL
    const originalDataUrl = signature.url;

    // 2. ASYNC: Get the tightly cropped URL
    getCroppedDataUrl(originalDataUrl).then((croppedDataUrl) => {
      const range = window.focusedEditor.getSelection(true);

      // Add positioning to signature data
      signatureCount++;
      const positionOffset = (signatureCount - 1) * 30;

      // 3. Pass the CROPPED URL to the Quill blot
      const signatureWithPosition = {
        ...signature,
        url: croppedDataUrl, // The key change: use the CROPPED URL for display
        positionOffset: positionOffset,
      };

      // Insert using our custom blot
      window.focusedEditor.insertEmbed(
        range.index,
        "signature",
        signatureWithPosition,
        "user"
      );

      // Set up events after insertion
      setTimeout(() => {
        const container = window.focusedEditor.root.querySelector(
          `[data-signature-id="${id}"]`
        );
        if (container) {
          // Apply positioning
          container.style.top = 20 + positionOffset + "px";
          setupSignatureContainerEvents(container);
        }
      }, 10);
    });
  }

  // ===== SETUP CONTAINER EVENTS =====
  function setupSignatureContainerEvents(container) {
    let isResizing = false;
    let isDragging = false;
    let currentHandle = null;
    let startX, startY, startWidth, startHeight;
    let startDragX, startDragY, startContainerLeft, startContainerTop;
    let rotation = 0;

    const img = container.querySelector("img");

    // Event delegation for container
    container.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      container.classList.toggle("selected");
    });

    container.addEventListener("click", (e) => {
      e.stopPropagation();
      document
        .querySelectorAll(".ql-signature-container.selected")
        .forEach((el) => {
          if (el !== container) el.classList.remove("selected");
        });
      container.classList.add("selected");
    });

    // Handle mousedown on container (for dragging) and resize handles
    container.addEventListener("mousedown", (e) => {
      // Check if it's a resize handle
      if (e.target.classList.contains("resize-handle")) {
        e.preventDefault();
        e.stopPropagation();
        initResize(e);
        return;
      }

      // Check if it's a tooltip button
      if (e.target.closest(".img-rotate") || e.target.closest(".img-delete")) {
        return;
      }

      // Otherwise, start dragging
      startDragging(e);
    });

    // Handle tooltip buttons with event delegation
    container.addEventListener("click", (e) => {
      if (e.target.closest(".img-rotate")) {
        e.stopPropagation();
        rotation = (rotation + 90) % 360;
        img.style.transform = `rotate(${rotation}deg)`;
      } else if (e.target.closest(".img-delete")) {
        e.stopPropagation();
        container.remove();
        signatureCount = Math.max(0, signatureCount - 1);
        if (window.focusedEditor) {
          window.focusedEditor.update("user");
        }
      }
    });

    function startDragging(e) {
      e.preventDefault();
      isDragging = true;

      const rect = container.getBoundingClientRect();
      const editorRect = container
        .closest(".ql-editor")
        .getBoundingClientRect();

      startDragX = e.clientX;
      startDragY = e.clientY;
      startContainerLeft = parseInt(container.style.left) || 0;
      startContainerTop = parseInt(container.style.top) || 0;

      container.classList.add("dragging");

      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDragging);
    }

    function drag(e) {
      if (!isDragging) return;

      const editorRect = container
        .closest(".ql-editor")
        .getBoundingClientRect();

      const deltaX = e.clientX - startDragX;
      const deltaY = e.clientY - startDragY;

      const newLeft = startContainerLeft + deltaX;
      const newTop = startContainerTop + deltaY;

      // Constrain within editor bounds
      const maxLeft = editorRect.width - container.offsetWidth - 10;
      const maxTop = editorRect.height - container.offsetHeight - 10;

      container.style.left = Math.max(10, Math.min(newLeft, maxLeft)) + "px";
      container.style.top = Math.max(10, Math.min(newTop, maxTop)) + "px";
    }

    function stopDragging() {
      isDragging = false;
      container.classList.remove("dragging");
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDragging);
    }

    function initResize(e) {
      isResizing = true;
      currentHandle = e.target.dataset.direction;

      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(
        document.defaultView.getComputedStyle(img).width,
        10
      );
      startHeight = parseInt(
        document.defaultView.getComputedStyle(img).height,
        10
      );
      // *** NEW: Capture starting position for repositioning during resizing ***
      startContainerLeft = parseInt(container.style.left) || 0;
      startContainerTop = parseInt(container.style.top) || 0;
      // **********************************************************************

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    }

    function resize(e) {
      if (!isResizing) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      switch (currentHandle) {
        // CORNER RESIZING (Existing Logic)
        case "se": // South-East
          newWidth = startWidth + dx;
          newHeight = startHeight + dy;
          break;
        case "sw": // South-West (change position for left move)
          newWidth = startWidth - dx;
          newHeight = startHeight + dy;
          container.style.left = startContainerLeft + dx + "px";
          break;
        case "ne": // North-East (change position for top move)
          newWidth = startWidth + dx;
          newHeight = startHeight - dy;
          container.style.top = startContainerTop + dy + "px";
          break;
        case "nw": // North-West (change position for top and left move)
          newWidth = startWidth - dx;
          newHeight = startHeight - dy;
          container.style.left = startContainerLeft + dx + "px";
          container.style.top = startContainerTop + dy + "px";
          break;

        // *** NEW MIDPOINT RESIZING LOGIC ***
        case "n": // North (only change height and top position)
          newHeight = startHeight - dy;
          container.style.top = startContainerTop + dy + "px";
          break;
        case "s": // South (only change height)
          newHeight = startHeight + dy;
          break;
        case "e": // East (only change width)
          newWidth = startWidth + dx;
          break;
        case "w": // West (only change width and left position)
          newWidth = startWidth - dx;
          container.style.left = startContainerLeft + dx + "px";
          break;
        // **********************************
      }

      // Set minimum size (remains the same)
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(30, newHeight);

      img.style.width = newWidth + "px";
      img.style.height = newHeight + "px";
    }

    function stopResize() {
      isResizing = false;
      currentHandle = null;
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    }
  }

  // Click outside to deselect
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".ql-signature-container")) {
      document
        .querySelectorAll(".ql-signature-container.selected")
        .forEach((el) => {
          el.classList.remove("selected");
        });
    }
  });

  function editSignature(id) {
    const signature = signatures.find((s) => s.id === id);
    if (signature) {
      document.querySelector('.tab-link[onclick*="New Signature"]').click();
      const img = new Image();
      img.onload = () => {
        clearCanvas();
        ctx.drawImage(img, 0, 0);
      };
      img.src = signature.url;
      deleteSignature(id, false);
    }
  }

  function deleteSignature(id, shouldRender = true) {
    signatures = signatures.filter((s) => s.id !== id);
    if (shouldRender) {
      renderSignatures();
    }
  }

  // --- Tab Switching Logic ---
  window.openTab = (evt, tabName) => {
    document
      .querySelectorAll(".tab-content")
      .forEach((tab) => (tab.style.display = "none"));
    document
      .querySelectorAll(".tab-link")
      .forEach((link) => link.classList.remove("active"));
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
  };

  // Initialize
  renderSignatures();
});
