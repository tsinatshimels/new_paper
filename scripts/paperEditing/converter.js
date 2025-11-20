// converter.js - ENHANCED VERSION

document.addEventListener("DOMContentLoaded", () => {
  // --- Main element selectors ---
  const convertElement = document.querySelector(".convert_document_element");
  const modal = document.getElementById("converter-modal");
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
  convertElement.addEventListener("click", (e) => {
    e.stopPropagation();
    converterSubmenu.style.display =
      converterSubmenu.style.display === "block" ? "none" : "block";
  });

  // Listen for clicks specifically inside the submenu <ul>
  const submenu = document.getElementById("converter-submenu-wrapper");
  if (submenu) {
    submenu.addEventListener("click", (e) => {
      const targetLi = e.target.closest("li[data-action]");
      if (!targetLi) return;

      const action = targetLi.dataset.action;
      convertElement.classList.remove("show-submenu");

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
        alert("Protect PDF functionality is coming soon!");
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

  let selectedJpgFiles = [];
  let jpgConversionInterval = null;

  // JPG Modal Event Listeners
  selectJpgFileBtn.addEventListener("click", () => {
    jpgFileInput.click();
  });

  jpgFileInput.addEventListener("change", (e) => {
    const newFiles = Array.from(e.target.files);
    selectedJpgFiles = [...selectedJpgFiles, ...newFiles];
    updateJpgFileDisplay();
    jpgContinueBtn.disabled = selectedJpgFiles.length === 0;
  });

  addMoreImagesBtn.addEventListener("click", () => {
    jpgFileInput.click();
  });

  jpgCancelBtn.addEventListener("click", () => {
    jpgModal.style.display = "none";
  });

  jpgContinueBtn.addEventListener("click", () => {
    jpgStep1.style.display = "none";
    jpgStep2.style.display = "block";
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
        selectedJpgFiles.map((file) => {
          const ext = file.name.split(".").pop().toLowerCase();
          return getTypeDisplayName(ext);
        })
      ),
    ];

    jpgStep3Title.textContent = `Converting ${fileTypes.join(", ")} to JPG`;
    jpgStep2.style.display = "none";
    jpgStep3.style.display = "block";
    simulateJpgConversion();
  });

  jpgCancelConversionBtn.addEventListener("click", () => {
    if (jpgConversionInterval) {
      clearInterval(jpgConversionInterval);
    }
    jpgModal.style.display = "none";
  });

  jpgBackToStep2.addEventListener("click", () => {
    jpgStep4.style.display = "none";
    jpgStep2.style.display = "block";
  });

  downloadJpgBtn.addEventListener("click", () => {
    // Create a zip file with all converted images
    alert("Downloading converted JPG files...");
    // In a real implementation, you would convert and zip the images here
    selectedJpgFiles.forEach((file, index) => {
      const link = document.createElement("a");
      link.download = `converted-${file.name.split(".")[0]}.jpg`;
      // For demo purposes, we'll create a dummy download
      link.href = URL.createObjectURL(file);
      link.click();
    });
  });

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
            selectedJpgFiles.map((file) => {
              const ext = file.name.split(".").pop().toLowerCase();
              return getTypeDisplayName(ext);
            })
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
        fileItem.innerHTML = `
          <span>${file.name}</span>
          <button class="remove-file" data-index="${index}">×</button>
        `;
        fileList.appendChild(fileItem);
      });

      selectedJpgFilesContainer.appendChild(fileList);

      // Add event listeners to remove buttons
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

    selectedJpgFiles.forEach((file, index) => {
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

    if (conversionInterval) {
      clearInterval(conversionInterval);
    }
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

    document.querySelector("#jpg-step-3 .progress-bar").style.width = "0%";
    document.querySelector("#jpg-step-3 .progress-percentage").textContent =
      "0%";

    if (jpgConversionInterval) {
      clearInterval(jpgConversionInterval);
    }
  }
});
