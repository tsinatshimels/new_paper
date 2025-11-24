// converter.js - ENHANCED VERSION

document.addEventListener("DOMContentLoaded", () => {
  // --- Main element selectors ---
  const convertElement = document.querySelector(".convert_document_element");
  const modal = document.getElementById("converter-modal");
  const protectModal = document.getElementById("protect-modal");
  const jpgModal = document.getElementById("jpg-converter-modal");
  const converterSubmenu = document.getElementById("converter-submenu-wrapper");

  // Exit if the essential elements aren't found on the page
  if (!convertElement || !modal) {
    console.error(
      "Converter trigger (.convert_document_element) or modal (#converter-modal) not found. Check your HTML."
    );
    return;
  }
  document
    .getElementById("show_file_option_dropdown")
    .addEventListener("click", () => {
      const dropdown = document.querySelector(".file_options_dropdown");

      dropdown.classList.toggle("file-hidden");
      console.log("file clicked");
    });

  // --- SUBMENU LOGIC ---

  const submenu = document.getElementById("converter-submenu-wrapper");

  convertElement.addEventListener("click", (e) => {
    e.stopPropagation();

    // Toggle submenu correctly
    submenu.style.display =
      submenu.style.display === "block" ? "none" : "block";
  });

  // Close submenu when clicking one of the submenu items
  if (submenu) {
    submenu.addEventListener("click", (e) => {
      const targetLi = e.target.closest("li[data-action]");
      if (!targetLi) return;

      // Close submenu after selecting an item
      submenu.style.display = "none";

      const action = targetLi.dataset.action;

      if (typeof closeDropdownBar === "function") {
        closeDropdownBar();
      }

      if (action === "to-pdf") {
        modal.style.display = "block";
        resetPdfModal();
      } else if (action === "to-jpg") {
        jpgModal.style.display = "block";
        resetJpgModal();
      } else if (action === "protect-pdf") {
        protectModal.style.display = "block";
        resetProtectModal();
      }
    });
  }

  // --- PDF CONVERTER LOGIC ---
  const step1 = document.getElementById("converter-step-1");
  const step2 = document.getElementById("converter-step-2");
  const step3 = document.getElementById("converter-step-3");
  const step4 = document.getElementById("converter-step-4");

  const step1Title = document.getElementById("converter-step-1-title");
  const step2Title = document.getElementById("converter-step-2-title");
  const step3Title = document.getElementById("converter-step-3-title");
  const successMessage = document.getElementById("success-message");

  const selectFileBtn = document.getElementById("select-file-btn");
  const fileInput = document.getElementById("file-input");
  const selectedFileName = document.getElementById("selected-file-name");
  const cancelBtn = document.getElementById("cancel-btn");
  const continueBtn = document.getElementById("continue-btn");
  const backToStep1 = document.getElementById("back-to-step-1");
  const convertNowBtn = document.getElementById("convert-now-btn");
  const backToStep2 = document.getElementById("back-to-step-2");
  const downloadPdfBtn = document.getElementById("download-pdf-btn");
  const cancelConversionBtn = document.getElementById("cancel-conversion-btn");

  let selectedFile = null;
  let selectedConversionType = null;
  let conversionInterval = null;

  // Converter option buttons
  const converterOptions = document.querySelectorAll(
    ".converter-option[data-type]"
  );

  converterOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      selectedConversionType = e.currentTarget.dataset.type;
      const typeName = getTypeDisplayName(selectedConversionType);
      step1Title.textContent = `Convert ${typeName} to PDF`;
    });
  });

  // PDF Modal Event Listeners
  selectFileBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
      selectedFileName.textContent = `Selected: ${selectedFile.name}`;
      continueBtn.disabled = false;

      // Auto-detect file type if no type selected
      if (!selectedConversionType) {
        const fileExt = selectedFile.name.split(".").pop().toLowerCase();
        selectedConversionType = detectFileType(fileExt);
        const typeName = getTypeDisplayName(selectedConversionType);
        step1Title.textContent = `Convert ${typeName} to PDF`;
      }
    }
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  continueBtn.addEventListener("click", () => {
    if (!selectedConversionType) return;

    const typeName = getTypeDisplayName(selectedConversionType);
    step2Title.innerHTML = `You are converting this file from <span class="blue-label">${typeName}</span> to <span class="red-label">PDF</span>`;
    step1.style.display = "none";
    step2.style.display = "block";
  });

  backToStep1.addEventListener("click", () => {
    step2.style.display = "none";
    step1.style.display = "block";
  });

  convertNowBtn.addEventListener("click", () => {
    const typeName = getTypeDisplayName(selectedConversionType);
    step3Title.innerHTML = `You are converting this file from <span class="blue-label">${typeName}</span> to <span class="red-label">PDF</span>`;
    step2.style.display = "none";
    step3.style.display = "block";
    simulatePdfConversion();
  });

  cancelConversionBtn.addEventListener("click", () => {
    if (conversionInterval) {
      clearInterval(conversionInterval);
    }
    modal.style.display = "none";
  });

  backToStep2.addEventListener("click", () => {
    step4.style.display = "none";
    step2.style.display = "block";
  });

  downloadPdfBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(
      `Converted from ${selectedConversionType.toUpperCase()} to PDF`,
      10,
      10
    );
    doc.text(`Original file: ${selectedFile.name}`, 10, 20);
    doc.save(`converted-${selectedFile.name.split(".")[0]}.pdf`);
  });

  // --- JPG CONVERTER LOGIC ---
  const jpgStep1 = document.getElementById("jpg-step-1");
  const jpgStep2 = document.getElementById("jpg-step-2");
  const jpgStep3 = document.getElementById("jpg-step-3");
  const jpgStep4 = document.getElementById("jpg-step-4");

  const jpgStep1Title = document.getElementById("jpg-step-1-title"); // Get Step 1 title
  const jpgStep2Title = document.getElementById("jpg-step-2-title");
  const jpgStep3Title = document.getElementById("jpg-step-3-title");
  const jpgSuccessMessage = document.getElementById("jpg-success-message");

  const selectJpgFileBtn = document.getElementById("select-jpg-file-btn");
  const jpgFileInput = document.getElementById("jpg-file-input");
  const selectedJpgFilesContainer =
    document.getElementById("selected-jpg-files");
  const jpgPreviewContainer = document.getElementById("jpg-preview-container");
  const jpgCancelBtn = document.getElementById("jpg-cancel-btn");
  const jpgContinueBtn = document.getElementById("jpg-continue-btn");
  const jpgBackToStep1 = document.getElementById("jpg-back-to-step-1");
  const convertToJpgBtn = document.getElementById("convert-to-jpg-btn");
  const jpgCancelConversionBtn = document.getElementById(
    "jpg-cancel-conversion-btn"
  );
  const jpgBackToStep2 = document.getElementById("jpg-back-to-step-2");
  const downloadJpgBtn = document.getElementById("download-jpg-btn");
  const addMoreImagesBtn = document.getElementById("add-more-images-btn");

  // NEW: Select all type tags
  const jpgTypeTags = document.querySelectorAll(".type-tag");

  let selectedJpgFiles = [];
  let jpgConversionInterval = null;

  // Click handler for JPG Type Tags
  jpgTypeTags.forEach((tag) => {
    tag.addEventListener("click", (e) => {
      const type = e.target.dataset.type;
      jpgStep1Title.textContent = `Convert ${type} to JPG`;
      // Optional: Immediately trigger file input
      // jpgFileInput.click();
    });
  });

  selectJpgFileBtn.addEventListener("click", () => jpgFileInput.click());

  jpgFileInput.addEventListener("change", (e) => {
    const newFiles = Array.from(e.target.files);
    selectedJpgFiles = [...selectedJpgFiles, ...newFiles];
    updateJpgFileDisplay();
    jpgContinueBtn.disabled = selectedJpgFiles.length === 0;
  });

  addMoreImagesBtn.addEventListener("click", () => jpgFileInput.click());

  jpgCancelBtn.addEventListener(
    "click",
    () => (jpgModal.style.display = "none")
  );

  jpgContinueBtn.addEventListener("click", () => {
    jpgStep1.style.display = "none";
    jpgStep2.style.display = "flex";
    updateJpgPreview();
  });

  jpgBackToStep1.addEventListener("click", () => {
    jpgStep2.style.display = "none";
    jpgStep1.style.display = "block";
  });

  convertToJpgBtn.addEventListener("click", () => {
    if (selectedJpgFiles.length === 0) return;
    const fileTypes = [
      ...new Set(
        selectedJpgFiles.map((file) =>
          getTypeDisplayName(file.name.split(".").pop().toLowerCase())
        )
      ),
    ];
    jpgStep3Title.textContent = `Converting ${fileTypes.join(", ")} to JPG`;
    jpgStep2.style.display = "none";
    jpgStep3.style.display = "block";
    simulateJpgConversion();
  });

  jpgCancelConversionBtn.addEventListener("click", () => {
    if (jpgConversionInterval) clearInterval(jpgConversionInterval);
    jpgModal.style.display = "none";
  });

  jpgBackToStep2.addEventListener("click", () => {
    jpgStep4.style.display = "none";
    jpgStep2.style.display = "flex";
  });

  // --- REPLACE THE OLD downloadJpgBtn LISTENER WITH THIS ---

  downloadJpgBtn.addEventListener("click", async () => {
    if (selectedJpgFiles.length === 0) {
      alert("No files found to download.");
      return;
    }

    // Helper function to convert and download a single file
    const processAndDownload = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const img = new Image();

          img.onload = () => {
            // 1. Create a canvas to handle conversion
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            // 2. Fill background white (because JPG doesn't support transparency)
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 3. Draw the original image onto the canvas
            ctx.drawImage(img, 0, 0);

            // 4. Convert the canvas content to a JPG Data URL
            // 0.9 represents 90% quality
            const jpgUrl = canvas.toDataURL("image/jpeg", 0.9);

            // 5. Create a temporary link to trigger download
            const link = document.createElement("a");
            link.href = jpgUrl;

            // Rename the file extension to .jpg
            const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            link.download = newFileName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            resolve();
          };

          img.src = e.target.result;
        };

        reader.readAsDataURL(file);
      });
    };

    // Loop through all selected files and download them
    // We use 'for...of' with await to prevent browser blocking multiple downloads
    for (const file of selectedJpgFiles) {
      await processAndDownload(file);
    }
  });

  // --- PROTECT PDF LOGIC (NEW) ---
  // --- PROTECT PDF LOGIC (REAL ENCRYPTION) ---
  const protectStep1 = document.getElementById("protect-step-1");
  const protectStep2 = document.getElementById("protect-step-2");
  const protectStep3 = document.getElementById("protect-step-3");
  const protectStep4 = document.getElementById("protect-step-4");

  const selectProtectFileBtn = document.getElementById(
    "select-protect-file-btn"
  );
  const protectFileInput = document.getElementById("protect-file-input");
  const protectCancelBtn = document.getElementById("protect-cancel-btn");

  const protectFileList = document.getElementById("protect-file-list");
  const protectAddMoreBtn = document.getElementById("protect-add-more-btn");
  const protectSubmitBtn = document.getElementById("protect-submit-btn");
  const protectBackStep1 = document.getElementById("protect-back-step-1");
  const protectBackHome = document.getElementById("protect-back-home");
  const downloadProtectedBtn = document.getElementById(
    "download-protected-btn"
  );

  const passwordInput = document.getElementById("pdf-password");
  const passwordConfirmInput = document.getElementById("pdf-password-confirm");
  const eyeToggles = document.querySelectorAll(".eye-toggle");

  let protectFiles = [];
  let protectedPdfBlobUrl = null; // Store the final file URL here

  // 1. File Selection
  selectProtectFileBtn.addEventListener("click", () =>
    protectFileInput.click()
  );

  // --- PROTECT PDF LOGIC (UPDATED WITH THUMBNAILS) ---

  // ... (Keep your existing element selectors here: protectStep1, selectProtectFileBtn, etc.) ...

  // 1. Helper Function: Generate Thumbnail from First Page
  async function generatePdfThumbnail(file) {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result);

        try {
          // Load the PDF
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          // Get the first page
          const page = await pdf.getPage(1);

          // Set scale for thumbnail (0.3 is usually good for small previews)
          const viewport = page.getViewport({ scale: 0.3 });

          // Create a canvas to render the page
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render page to canvas
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          // Return the image data URL
          resolve(canvas.toDataURL());
        } catch (error) {
          console.error("Thumbnail generation failed", error);
          resolve(null); // Return null if it fails (will show icon instead)
        }
      };
      fileReader.readAsArrayBuffer(file);
    });
  }

  // 2. File Selection Listener (Modified)
  protectFileInput.addEventListener("change", async (e) => {
    const newFiles = Array.from(e.target.files);

    // Process files one by one to generate thumbnails
    for (const file of newFiles) {
      // Create a temporary property on the file object to store the thumbnail
      file.thumbnailSrc = await generatePdfThumbnail(file);
      protectFiles.push(file);
    }

    if (protectFiles.length > 0) {
      updateProtectFileList();
      protectStep1.style.display = "none";
      protectStep2.style.display = "block";
    }
  });

  // 3. Update File List Display (Modified to show Image)
  function updateProtectFileList() {
    protectFileList.innerHTML = "";
    protectFiles.forEach((file, index) => {
      const item = document.createElement("div");
      item.className = "protect-file-item";

      // Check if we have a generated thumbnail
      let previewHtml = "";
      if (file.thumbnailSrc) {
        previewHtml = `<img src="${file.thumbnailSrc}" style="width: 40px; height: 50px; object-fit: cover; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px;">`;
      } else {
        // Fallback icon if generation failed
        previewHtml = `<span style="font-size: 24px; margin-right: 10px;">📄</span>`;
      }

      item.innerHTML = `
        <div style="display: flex; align-items: center;">
          ${previewHtml}
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; font-size: 14px;">${file.name}</span>
        </div>
        <button class="remove-protect-file" data-index="${index}" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #ff4d4d;">&times;</button>
      `;

      // Add simple styling for the item layout
      item.style.display = "flex";
      item.style.justifyContent = "space-between";
      item.style.alignItems = "center";
      item.style.padding = "8px";
      item.style.marginBottom = "8px";
      item.style.background = "#f8f9fa";
      item.style.borderRadius = "6px";

      protectFileList.appendChild(item);
    });

    // Re-attach remove listeners
    document.querySelectorAll(".remove-protect-file").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.dataset.index);
        protectFiles.splice(idx, 1);
        updateProtectFileList();
        if (protectFiles.length === 0) {
          protectStep2.style.display = "none";
          protectStep1.style.display = "block";
        }
      });
    });
  }

  // ... (Keep the rest of your logic: addMoreBtn, submitBtn, etc.) ...

  // 2. Add More Files
  protectAddMoreBtn.addEventListener("click", () => protectFileInput.click());

  // 3. Password Toggle
  eyeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (input.type === "password") {
        input.type = "text";
        toggle.style.color = "#007bff";
      } else {
        input.type = "password";
        toggle.style.color = "#777";
      }
    });
  });

  // 4. Validation
  function validatePasswords() {
    const p1 = passwordInput.value;
    const p2 = passwordConfirmInput.value;
    if (p1 && p2 && p1 === p2) {
      protectSubmitBtn.disabled = false;
    } else {
      protectSubmitBtn.disabled = true;
    }
  }

  passwordInput.addEventListener("input", validatePasswords);
  passwordConfirmInput.addEventListener("input", validatePasswords);

  // 5. Submit & Process (Actual Encryption)

  protectSubmitBtn.addEventListener("click", async () => {
    // 1. Check if the required library is loaded
    if (typeof PDFLib === "undefined") {
      alert(
        "Error: PDF-Lib library is missing. Please add the script tag to your HTML."
      );
      return;
    }

    protectStep2.style.display = "none";
    protectStep3.style.display = "block";

    const progressBar = document.querySelector("#protect-step-3 .progress-bar");
    const progressText = document.querySelector(
      "#protect-step-3 .progress-percentage"
    );
    let width = 10;

    // Fake progress animation while we process
    const progressInterval = setInterval(() => {
      if (width < 90) {
        width += 5;
        progressBar.style.width = width + "%";
        progressText.textContent = width + "%";
      }
    }, 200);

    try {
      const { PDFDocument } = PDFLib;
      const password = passwordInput.value;

      // We process the first selected file
      const file = protectFiles[0];
      const fileBuffer = await file.arrayBuffer();

      // 2. Load the PDF
      const pdfDoc = await PDFDocument.load(fileBuffer);

      // 3. Encrypt and Save
      // This creates a byte array of the encrypted PDF
      const pdfBytes = await pdfDoc.save({
        encrypt: {
          userPassword: password, // Password needed to OPEN the file
          ownerPassword: password + "123", // Password needed to EDIT permissions (different from user pass)
          permissions: {
            printing: "highResolution",
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: false,
            contentAccessibility: false,
            documentAssembly: false,
          },
        },
      });

      // 4. Create the download blob
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      protectedPdfBlobUrl = URL.createObjectURL(blob);

      // Complete progress bar
      clearInterval(progressInterval);
      progressBar.style.width = "100%";
      progressText.textContent = "100%";

      // Show success message
      setTimeout(() => {
        protectStep3.style.display = "none";
        protectStep4.style.display = "block";
      }, 500);
    } catch (error) {
      console.error("Encryption Failed:", error);
      clearInterval(progressInterval);
      alert(
        "An error occurred while encrypting the PDF. See console for details."
      );

      // Reset logic on failure
      protectStep3.style.display = "none";
      protectStep2.style.display = "block";
    }
  });

  // 6. Navigation & Download
  protectCancelBtn.addEventListener(
    "click",
    () => (protectModal.style.display = "none")
  );

  protectBackStep1.addEventListener("click", () => {
    protectStep2.style.display = "none";
    protectStep1.style.display = "block";
    protectFiles = [];
    protectFileInput.value = "";
  });

  protectBackHome.addEventListener("click", () => {
    protectModal.style.display = "none";
    resetProtectModal();
  });

  downloadProtectedBtn.addEventListener("click", () => {
    if (protectedPdfBlobUrl) {
      const link = document.createElement("a");
      link.href = protectedPdfBlobUrl;
      link.download = "protected-document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });

  function resetProtectModal() {
    protectStep1.style.display = "block";
    protectStep2.style.display = "none";
    protectStep3.style.display = "none";
    protectStep4.style.display = "none";

    protectFiles = [];
    protectFileInput.value = "";
    passwordInput.value = "";
    passwordConfirmInput.value = "";
    protectSubmitBtn.disabled = true;
    protectFileList.innerHTML = "";

    if (protectedPdfBlobUrl) {
      URL.revokeObjectURL(protectedPdfBlobUrl);
      protectedPdfBlobUrl = null;
    }

    document.querySelector("#protect-step-3 .progress-bar").style.width = "0%";
    document.querySelector("#protect-step-3 .progress-percentage").innerText =
      "0%";
  }
  // --- Helper Functions ---
  function getTypeDisplayName(type) {
    const typeMap = {
      jpg: "JPG",
      jpeg: "JPG",
      png: "PNG",
      gif: "GIF",
      psd: "PSD",
      svg: "SVG",
      webp: "WebP",
      heic: "HEIC",
      raw: "RAW",
      word: "Word",
      doc: "Word",
      docx: "Word",
      powerpoint: "PowerPoint",
      ppt: "PowerPoint",
      pptx: "PowerPoint",
      excel: "Excel",
      xls: "Excel",
      xlsx: "Excel",
      html: "HTML",
    };
    return typeMap[type] || type.toUpperCase();
  }

  function detectFileType(extension) {
    const typeMap = {
      jpg: "jpg",
      jpeg: "jpg",
      png: "png",
      gif: "gif",
      doc: "word",
      docx: "word",
      ppt: "powerpoint",
      pptx: "powerpoint",
      xls: "excel",
      xlsx: "excel",
      html: "html",
      htm: "html",
    };
    return typeMap[extension] || "file";
  }

  function simulatePdfConversion() {
    const progressBar = document.querySelector(
      "#converter-step-3 .progress-bar"
    );
    const progressPercentage = document.querySelector(
      "#converter-step-3 .progress-percentage"
    );
    let width = 0;
    conversionInterval = setInterval(() => {
      if (width >= 100) {
        clearInterval(conversionInterval);
        step3.style.display = "none";
        step4.style.display = "block";
        const typeName = getTypeDisplayName(selectedConversionType);
        successMessage.textContent = `Successfully converted from ${typeName} to PDF`;
      } else {
        width++;
        progressBar.style.width = width + "%";
        progressPercentage.textContent = width + "%";
      }
    }, 50);
  }

  function simulateJpgConversion() {
    const progressBar = document.querySelector("#jpg-step-3 .progress-bar");
    const progressPercentage = document.querySelector(
      "#jpg-step-3 .progress-percentage"
    );
    let width = 0;
    jpgConversionInterval = setInterval(() => {
      if (width >= 100) {
        clearInterval(jpgConversionInterval);
        jpgStep3.style.display = "none";
        jpgStep4.style.display = "block";
        const fileTypes = [
          ...new Set(
            selectedJpgFiles.map((file) =>
              getTypeDisplayName(file.name.split(".").pop().toLowerCase())
            )
          ),
        ];
        jpgSuccessMessage.textContent = `Successfully converted from ${fileTypes.join(
          ", "
        )} to JPG`;
      } else {
        width++;
        progressBar.style.width = width + "%";
        progressPercentage.textContent = width + "%";
      }
    }, 50);
  }

  function updateJpgFileDisplay() {
    selectedJpgFilesContainer.innerHTML = "";
    if (selectedJpgFiles.length > 0) {
      const fileList = document.createElement("div");
      fileList.className = "file-list";
      fileList.innerHTML = `<p>Selected ${selectedJpgFiles.length} image(s):</p>`;
      selectedJpgFiles.forEach((file, index) => {
        const fileItem = document.createElement("div");
        fileItem.className = "file-item";
        fileItem.innerHTML = `<span>${file.name}</span><button class="remove-file" data-index="${index}">×</button>`;
        fileList.appendChild(fileItem);
      });
      selectedJpgFilesContainer.appendChild(fileList);
      document.querySelectorAll(".remove-file").forEach((button) => {
        button.addEventListener("click", (e) => {
          const index = parseInt(e.target.dataset.index);
          selectedJpgFiles.splice(index, 1);
          updateJpgFileDisplay();
          jpgContinueBtn.disabled = selectedJpgFiles.length === 0;
        });
      });
    }
  }

  function updateJpgPreview() {
    jpgPreviewContainer.innerHTML = "";
    jpgStep2Title.textContent = `Convert ${selectedJpgFiles.length} image(s) to JPG`;
    selectedJpgFiles.forEach((file) => {
      const previewItem = document.createElement("div");
      previewItem.className = "preview-item";
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        previewItem.appendChild(img);
      }
      const fileName = document.createElement("p");
      fileName.textContent = file.name;
      previewItem.appendChild(fileName);
      jpgPreviewContainer.appendChild(previewItem);
    });
  }

  function resetPdfModal() {
    step1.style.display = "block";
    step2.style.display = "none";
    step3.style.display = "none";
    step4.style.display = "none";
    selectedFile = null;
    selectedConversionType = null;
    selectedFileName.textContent = "";
    continueBtn.disabled = true;
    fileInput.value = "";
    step1Title.textContent = "Convert to PDF";
    document.querySelector("#converter-step-3 .progress-bar").style.width =
      "0%";
    document.querySelector(
      "#converter-step-3 .progress-percentage"
    ).textContent = "0%";
    if (conversionInterval) clearInterval(conversionInterval);
  }

  function resetJpgModal() {
    jpgStep1.style.display = "block";
    jpgStep2.style.display = "none";
    jpgStep3.style.display = "none";
    jpgStep4.style.display = "none";
    selectedJpgFiles = [];
    selectedJpgFilesContainer.innerHTML = "";
    jpgPreviewContainer.innerHTML = "";
    jpgContinueBtn.disabled = true;
    jpgFileInput.value = "";
    jpgStep1Title.textContent = "Convert Image to JPG"; // Reset title
    document.querySelector("#jpg-step-3 .progress-bar").style.width = "0%";
    document.querySelector("#jpg-step-3 .progress-percentage").textContent =
      "0%";
    if (jpgConversionInterval) clearInterval(jpgConversionInterval);
  }

  // function resetProtectModal() {
  //   protectStep1.style.display = "block";
  //   protectStep2.style.display = "none";
  //   protectStep3.style.display = "none";
  //   protectStep4.style.display = "none";
  //   protectFiles = [];
  //   protectFileInput.value = "";
  //   passwordInput.value = "";
  //   passwordConfirmInput.value = "";
  //   protectSubmitBtn.disabled = true;
  //   protectFileList.innerHTML = "";
  //   document.querySelector("#protect-step-3 .progress-bar").style.width = "0%";
  //   if (protectInterval) clearInterval(protectInterval);
  // }
});
