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
    convertElement.classList.toggle("active-convert-document-element");
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
        convertElement.classList.remove("active-convert-document-element");
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

  // Close modals on outside click
  document.addEventListener("mousedown", (e) => {
    // Converter modal
    if (modal.style.display === "block") {
      if (!e.target.closest("#converter-modal .converter-modal-content")) {
        modal.style.display = "none";
      }
    }
    // JPG modal
    if (jpgModal.style.display === "block") {
      if (!e.target.closest("#jpg-converter-modal .converter-modal-content")) {
        jpgModal.style.display = "none";
      }
    }
    // Protect modal
    if (protectModal.style.display === "block") {
      if (!e.target.closest("#protect-modal .converter-modal-content")) {
        protectModal.style.display = "none";
      }
    }
  });

  // Close modals on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal.style.display === "block") modal.style.display = "none";
      if (jpgModal.style.display === "block") jpgModal.style.display = "none";
      if (protectModal.style.display === "block")
        protectModal.style.display = "none";
    }
  });

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
  let selectedConversionTarget = null; // target for reverse conversion (from PDF)
  let conversionInterval = null;
  let conversionDirection = "to-pdf"; // can be 'to-pdf' or 'from-pdf'

  // Converter option buttons
  const converterOptions = document.querySelectorAll(
    ".converter-option[data-type]"
  );

  // Toggle direction button
  const toggleDirectionBtn = document.getElementById(
    "toggle-conversion-direction"
  );

  toggleDirectionBtn.addEventListener("click", () => {
    if (conversionDirection === "to-pdf") {
      conversionDirection = "from-pdf";
      toggleDirectionBtn.textContent = "Convert from PDF";
      // Update title
      step1Title.textContent = "Convert from PDF";
      // Ensure file input accepts PDFs only in this mode
      fileInput.accept = ".pdf";
      // Update button labels to show reverse intent
      converterOptions.forEach((opt) => {
        const target = opt.dataset.target || opt.dataset.type;
        opt.querySelector("span").textContent = `PDF to ${getTypeDisplayName(
          target
        )}`;
      });
    } else {
      conversionDirection = "to-pdf";
      toggleDirectionBtn.textContent = "Convert to PDF";
      step1Title.textContent = "Convert to PDF";
      // Reset file input accept
      fileInput.accept = getAcceptAttributeForType(selectedConversionType);
      // Restore original labels
      converterOptions.forEach((opt) => {
        const src = opt.dataset.type;
        opt.querySelector("span").textContent = `${getTypeDisplayName(
          src
        )} to PDF`;
      });
    }
  });

  converterOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      if (conversionDirection === "to-pdf") {
        selectedConversionType = e.currentTarget.dataset.type;
        const typeName = getTypeDisplayName(selectedConversionType);
        step1Title.textContent = `Convert ${typeName} to PDF`;

        // Update file input accept attribute based on selected type
        fileInput.accept = getAcceptAttributeForType(selectedConversionType);
      } else {
        // conversionDirection === 'from-pdf'
        selectedConversionTarget =
          e.currentTarget.dataset.target || e.currentTarget.dataset.type;
        const targetName = getTypeDisplayName(selectedConversionTarget);
        step1Title.textContent = `Convert PDF to ${targetName}`;
        // Accept PDF instead when converting from PDF
        fileInput.accept = ".pdf";
      }
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
      if (!selectedConversionType && conversionDirection === "to-pdf") {
        const fileExt = selectedFile.name.split(".").pop().toLowerCase();
        selectedConversionType = detectFileType(fileExt);
        const typeName = getTypeDisplayName(selectedConversionType);
        step1Title.textContent = `Convert ${typeName} to PDF`;
        // Update accept attribute based on detected type
        fileInput.accept = getAcceptAttributeForType(selectedConversionType);
      }
      // If in from-pdf mode and we have no selectedConversionTarget, guess JPG as default
      if (conversionDirection === "from-pdf" && !selectedConversionTarget) {
        // default to JPG when converting from PDF
        selectedConversionTarget = "jpg";
        const targetName = getTypeDisplayName(selectedConversionTarget);
        step1Title.textContent = `Convert PDF to ${targetName}`;
        fileInput.accept = ".pdf";
      }
    }
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  continueBtn.addEventListener("click", () => {
    if (conversionDirection === "to-pdf") {
      if (!selectedConversionType) return;
      const typeName = getTypeDisplayName(selectedConversionType);
      step2Title.innerHTML = `You are converting this file from <span class="blue-label">${typeName}</span> to <span class="red-label">PDF</span>`;
    } else {
      if (!selectedConversionTarget) return;
      const targetName = getTypeDisplayName(selectedConversionTarget);
      step2Title.innerHTML = `You are converting this file from <span class="blue-label">PDF</span> to <span class="red-label">${targetName}</span>`;
    }
    step1.style.display = "none";
    step2.style.display = "block";
  });

  backToStep1.addEventListener("click", () => {
    step2.style.display = "none";
    step1.style.display = "block";
  });

  convertNowBtn.addEventListener("click", () => {
    if (conversionDirection === "to-pdf") {
      const typeName = getTypeDisplayName(selectedConversionType);
      step3Title.innerHTML = `You are converting this file from <span class="blue-label">${typeName}</span> to <span class="red-label">PDF</span>`;
      step2.style.display = "none";
      step3.style.display = "block";
      simulatePdfConversion();
    } else {
      const targetName = getTypeDisplayName(selectedConversionTarget || "jpg");
      step3Title.innerHTML = `You are converting this file from <span class="blue-label">PDF</span> to <span class="red-label">${targetName}</span>`;
      step2.style.display = "none";
      step3.style.display = "block";
      // Simulate and then process conversion PDF -> target (e.g., JPG)
      simulatePdfConversion();
    }
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

  downloadPdfBtn.addEventListener("click", async () => {
    try {
      if (conversionDirection === "to-pdf") {
        await convertFileToPdf(selectedFile, selectedConversionType);
      } else {
        // from PDF - determine target
        const target = selectedConversionTarget || "jpg";
        if (target === "jpg") {
          await convertPdfToJpg(selectedFile);
        } else {
          alert("This reverse conversion is not supported yet.");
        }
      }
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Error converting file: " + error.message);
    }
  });

  // When in from-pdf mode, download button behavior should convert pdf to chosen target
  // Replace the existing click on convertNow? Keep separate: we'll handle conversion in step3 completion.

  // Function to convert different file types to PDF
  async function convertFileToPdf(file, conversionType) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const fileName = file.name.split(".")[0];

    switch (conversionType) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        await convertImageToPdf(doc, file);
        break;
      case "word":
      case "doc":
      case "docx":
        await convertWordToPdf(doc, file);
        break;
      case "powerpoint":
      case "ppt":
      case "pptx":
        await convertPowerPointToPdf(doc, file);
        break;
      case "excel":
      case "xls":
      case "xlsx":
        await convertExcelToPdf(doc, file);
        break;
      case "html":
      case "htm":
        await convertHtmlToPdf(doc, file);
        break;
      default:
        throw new Error("Unsupported file type for conversion");
    }

    doc.save(`converted-${fileName}.pdf`);
  }

  // Convert PDF to JPG pages (multi-page support)
  async function convertPdfToJpg(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        const jpgUrl = canvas.toDataURL("image/jpeg", 0.95);
        const blob = dataURLToBlob(jpgUrl);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${file.name.replace(/\.[^/.]+$/, "")}_page${i}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Free object URL
        URL.revokeObjectURL(link.href);
      }
    } catch (err) {
      console.error("PDF to JPG conversion failed:", err);
      alert("Error converting PDF to JPG: " + err.message);
    }
  }

  function dataURLToBlob(dataurl) {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = (mimeMatch && mimeMatch[1]) || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  // Convert Image to PDF
  async function convertImageToPdf(doc, file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const imgWidth = img.width;
          const imgHeight = img.height;
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = doc.internal.pageSize.getHeight();

          // Calculate dimensions to fit the page while maintaining aspect ratio
          let width = imgWidth;
          let height = imgHeight;
          const ratio = Math.min(pdfWidth / width, pdfHeight / height);
          width = width * ratio;
          height = height * ratio;

          // Center the image on the page
          const x = (pdfWidth - width) / 2;
          const y = (pdfHeight - height) / 2;

          // Determine image format based on file type
          const fileExt = file.name.split(".").pop().toLowerCase();
          let format = "JPEG"; // default
          let imageData = e.target.result;

          // For WebP and other formats that jsPDF might not support directly,
          // convert to canvas first
          if (fileExt === "webp" || fileExt === "heic" || fileExt === "raw") {
            const canvas = document.createElement("canvas");
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            imageData = canvas.toDataURL("image/jpeg", 0.95);
            format = "JPEG";
          } else if (fileExt === "png") {
            format = "PNG";
          } else if (fileExt === "gif") {
            format = "GIF";
          }

          doc.addImage(imageData, format, x, y, width, height);
          resolve();
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  // Convert Word (DOCX) to PDF
  async function convertWordToPdf(doc, file) {
    if (typeof mammoth === "undefined") {
      throw new Error(
        "Mammoth library is not loaded. Please include the script tag."
      );
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = result.value;

      // Create a temporary div to parse HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      // Extract text content and format it
      const textContent = tempDiv.innerText || tempDiv.textContent;
      const lines = textContent.split("\n").filter((line) => line.trim());

      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 7;

      lines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }

        // Split long lines to fit page width
        const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
        const splitLines = doc.splitTextToSize(line, maxWidth);

        splitLines.forEach((splitLine) => {
          if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(splitLine, margin, yPosition);
          yPosition += lineHeight;
        });
      });
    } catch (error) {
      throw new Error("Failed to convert Word document: " + error.message);
    }
  }

  // Convert PowerPoint to PDF
  async function convertPowerPointToPdf(doc, file) {
    // PowerPoint conversion is complex - for now, we'll extract text if possible
    // Note: Full PPTX conversion requires server-side processing or specialized libraries
    doc.text("PowerPoint to PDF conversion", 20, 20);
    doc.text(
      "Note: Full PowerPoint conversion requires specialized processing.",
      20,
      30
    );
    doc.text(`Original file: ${file.name}`, 20, 40);
    doc.text(
      "For best results, please use Microsoft PowerPoint to export as PDF.",
      20,
      50
    );

    // If the file is a PPTX (ZIP-based), we could try to extract text
    // For now, we'll show a message
    return Promise.resolve();
  }

  // Convert Excel to PDF
  async function convertExcelToPdf(doc, file) {
    if (typeof XLSX === "undefined") {
      throw new Error(
        "SheetJS library is not loaded. Please include the script tag."
      );
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert to JSON array
      const data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      });

      if (data.length === 0) {
        doc.text("No data found in Excel file", 20, 20);
        return;
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const startX = margin;
      let startY = margin;
      const rowHeight = 7;
      const colWidth =
        (pageWidth - margin * 2) / Math.min(data[0]?.length || 1, 5);

      data.forEach((row, rowIndex) => {
        if (startY + rowHeight > pageHeight - margin) {
          doc.addPage();
          startY = margin;
        }

        row.slice(0, 5).forEach((cell, colIndex) => {
          const x = startX + colIndex * colWidth;
          const cellText = String(cell || "").substring(0, 20); // Limit text length
          doc.text(cellText, x, startY);
        });

        startY += rowHeight;
      });
    } catch (error) {
      throw new Error("Failed to convert Excel file: " + error.message);
    }
  }

  // Convert HTML to PDF
  async function convertHtmlToPdf(doc, file) {
    try {
      const text = await file.text();

      // Create a temporary div to parse HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = text;

      // Extract text content
      const textContent = tempDiv.innerText || tempDiv.textContent;
      const lines = textContent.split("\n").filter((line) => line.trim());

      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 7;
      const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;

      lines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }

        const splitLines = doc.splitTextToSize(line, maxWidth);
        splitLines.forEach((splitLine) => {
          if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(splitLine, margin, yPosition);
          yPosition += lineHeight;
        });
      });
    } catch (error) {
      throw new Error("Failed to convert HTML file: " + error.message);
    }
  }

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

  if (selectJpgFileBtn && jpgFileInput) {
    selectJpgFileBtn.addEventListener("click", () => jpgFileInput.click());
  }

  if (jpgFileInput) {
    jpgFileInput.addEventListener("change", (e) => {
      const newFiles = Array.from(e.target.files || []);
      selectedJpgFiles = [...selectedJpgFiles, ...newFiles];
      updateJpgFileDisplay();
      // Automatically go to preview step when files selected
      if (jpgStep1 && jpgStep2) {
        if (
          jpgStep1.style.display === "block" ||
          jpgStep1.style.display === ""
        ) {
          jpgStep1.style.display = "none";
          jpgStep2.style.display = "flex";
          updateJpgPreview();
        } else if (jpgStep2.style.display === "flex") {
          // If already in preview, just update preview with new files
          updateJpgPreview();
        }
      }
      if (jpgContinueBtn)
        jpgContinueBtn.disabled = selectedJpgFiles.length === 0;
    });
  }

  if (addMoreImagesBtn) {
    addMoreImagesBtn.addEventListener("click", () => {
      if (jpgFileInput) jpgFileInput.click();
    });
  }

  if (jpgCancelBtn) {
    jpgCancelBtn.addEventListener(
      "click",
      () => (jpgModal.style.display = "none")
    );
  }

  if (jpgContinueBtn) {
    jpgContinueBtn.addEventListener("click", () => {
      jpgStep1.style.display = "none";
      jpgStep2.style.display = "flex";
      updateJpgPreview();
    });
  }

  if (jpgBackToStep1) {
    jpgBackToStep1.addEventListener("click", () => {
      jpgStep2.style.display = "none";
      jpgStep1.style.display = "block";
    });
  }

  if (convertToJpgBtn) {
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
  }

  if (jpgCancelConversionBtn) {
    jpgCancelConversionBtn.addEventListener("click", () => {
      if (jpgConversionInterval) clearInterval(jpgConversionInterval);
      jpgModal.style.display = "none";
    });
  }

  if (jpgBackToStep2) {
    jpgBackToStep2.addEventListener("click", () => {
      jpgStep4.style.display = "none";
      jpgStep2.style.display = "flex";
    });
  }

  // --- REPLACE THE OLD downloadJpgBtn LISTENER WITH THIS ---

  if (downloadJpgBtn) {
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
  }

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
  // const protectCancelBtn = document.getElementById("protect-cancel-btn");

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

  const passwordErrorEl = document.getElementById("pdf-password-error");
  const passwordRequiredErrorEl = document.getElementById(
    "pdf-password-required-error"
  );

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
    const p1 = passwordInput.value || "";
    const p2 = passwordConfirmInput.value || "";

    // Clear errors by default
    if (passwordErrorEl) passwordErrorEl.style.display = "none";
    if (passwordRequiredErrorEl) passwordRequiredErrorEl.style.display = "none";

    // Required check for password (show only if user started typing in confirm)
    if (!p1 && p2) {
      if (passwordRequiredErrorEl) {
        passwordRequiredErrorEl.textContent = "Password is required";
        passwordRequiredErrorEl.style.display = "block";
      }
      protectSubmitBtn.disabled = true;
      return;
    }

    // If both present and equal -> enable
    if (p1 && p2 && p1 === p2) {
      protectSubmitBtn.disabled = false;
      if (passwordErrorEl) passwordErrorEl.style.display = "none";
      return;
    }

    // If both present and not equal -> show mismatch
    if (p1 && p2 && p1 !== p2) {
      if (passwordErrorEl) {
        passwordErrorEl.textContent = "Passwords do not match";
        passwordErrorEl.style.display = "block";
      }
      protectSubmitBtn.disabled = true;
      return;
    }

    // Default: disable submit
    protectSubmitBtn.disabled = true;
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

      if (!password || password.trim() === "") {
        throw new Error("Password cannot be empty");
      }

      // We process the first selected file
      const file = protectFiles[0];
      const fileBuffer = await file.arrayBuffer();

      // 2. Load the PDF (if already encrypted, it will need password - for now we assume it's not encrypted)
      let pdfDoc;
      try {
        pdfDoc = await PDFDocument.load(fileBuffer);
      } catch (loadError) {
        // If PDF is already encrypted, try loading without password first
        if (loadError.message && loadError.message.includes("password")) {
          throw new Error(
            "This PDF is already password protected. Please use an unprotected PDF."
          );
        }
        throw new Error("Failed to load PDF: " + loadError.message);
      }

      // 3. Encrypt and Save with proper encryption settings
      // The userPassword is what prompts for password when opening the PDF
      // The ownerPassword is used for permissions (can be same as userPassword)
      console.log("Encrypting PDF with password protection...");
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: false, // Ensure compatibility
        addDefaultPage: false,
        encrypt: {
          userPassword: password, // This password is required to OPEN the file - prompts when opening
          ownerPassword: password, // Owner password (can be same as user password)
          permissions: {
            printing: "highResolution", // Allow printing
            modifying: false, // Prevent modifications
            copying: false, // Prevent copying
            annotating: false, // Prevent annotations
            fillingForms: false, // Prevent form filling
            contentAccessibility: false, // Prevent content accessibility
            documentAssembly: false, // Prevent document assembly
          },
        },
      });

      console.log(
        "PDF encrypted successfully. Size:",
        pdfBytes.length,
        "bytes"
      );

      // 4. Create the download blob
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Revoke old URL if exists
      if (protectedPdfBlobUrl) {
        URL.revokeObjectURL(protectedPdfBlobUrl);
      }

      protectedPdfBlobUrl = URL.createObjectURL(blob);
      console.log("Protected PDF ready for download");

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
      alert("An error occurred while encrypting the PDF: " + error.message);

      // Reset logic on failure
      protectStep3.style.display = "none";
      protectStep2.style.display = "block";
    }
  });

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
    if (protectedPdfBlobUrl && protectFiles.length > 0) {
      const originalFileName = protectFiles[0].name;
      const fileNameWithoutExt = originalFileName.replace(/\.[^/.]+$/, "");
      const link = document.createElement("a");
      link.href = protectedPdfBlobUrl;
      link.download = `${fileNameWithoutExt}-protected.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No protected PDF available. Please protect a PDF first.");
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
      png: "jpg",
      gif: "jpg",
      webp: "jpg",
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

  function getAcceptAttributeForType(type) {
    const acceptMap = {
      jpg: ".jpg,.jpeg,.png,.gif,.webp",
      word: ".doc,.docx",
      powerpoint: ".ppt,.pptx",
      excel: ".xls,.xlsx",
      html: ".html,.htm",
    };
    return acceptMap[type] || "*";
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
        if (conversionDirection === "to-pdf") {
          const typeName = getTypeDisplayName(selectedConversionType);
          successMessage.textContent = `Successfully converted from ${typeName} to PDF`;
        } else {
          const targetName = getTypeDisplayName(
            selectedConversionTarget || "jpg"
          );
          successMessage.textContent = `Successfully converted from PDF to ${targetName}`;
          // Wait for the user to click Download (downloadPdfBtn handler will perform the conversion)
        }
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
    if (!selectedJpgFilesContainer) return;
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
          if (jpgContinueBtn)
            jpgContinueBtn.disabled = selectedJpgFiles.length === 0;
        });
      });
    }
  }

  function updateJpgPreview() {
    if (!jpgPreviewContainer) return;
    jpgPreviewContainer.innerHTML = "";
    jpgStep2Title.textContent = `Convert ${selectedJpgFiles.length} image(s) to JPG`;
    // Layout side-by-side
    jpgPreviewContainer.style.display = "flex";
    jpgPreviewContainer.style.flexWrap = "wrap";
    jpgPreviewContainer.style.gap = "10px";
    selectedJpgFiles.forEach((file) => {
      const previewItem = document.createElement("div");
      previewItem.className = "preview-item";
      previewItem.style.width = "120px";
      previewItem.style.display = "flex";
      previewItem.style.flexDirection = "column";
      previewItem.style.alignItems = "center";
      previewItem.style.justifyContent = "center";
      previewItem.style.gap = "6px";
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        img.style.width = "100%";
        img.style.height = "80px";
        img.style.objectFit = "cover";
        previewItem.appendChild(img);
      }
      const fileName = document.createElement("p");
      fileName.textContent = file.name;
      previewItem.appendChild(fileName);
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-preview-file";
      removeBtn.textContent = "×";
      removeBtn.style.marginTop = "6px";
      removeBtn.style.background = "#fff";
      removeBtn.style.border = "1px solid #ddd";
      removeBtn.style.borderRadius = "50%";
      removeBtn.style.width = "28px";
      removeBtn.style.height = "28px";
      removeBtn.style.cursor = "pointer";
      previewItem.prepend(removeBtn);
      removeBtn.addEventListener("click", () => {
        // remove file from selectedJpgFiles array
        const idx = selectedJpgFiles.indexOf(file);
        if (idx > -1) {
          selectedJpgFiles.splice(idx, 1);
          updateJpgPreview();
          updateJpgFileDisplay();
        }
      });
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
    selectedConversionTarget = null;
    selectedFileName.textContent = "";
    continueBtn.disabled = true;
    fileInput.value = "";
    step1Title.textContent = "Convert to PDF";
    conversionDirection = "to-pdf";
    if (toggleDirectionBtn) toggleDirectionBtn.textContent = "Convert to PDF";
    // Restore original labels
    converterOptions.forEach((opt) => {
      const src = opt.dataset.type;
      opt.querySelector("span").textContent = `${getTypeDisplayName(
        src
      )} to PDF`;
    });
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
    if (selectedJpgFilesContainer) selectedJpgFilesContainer.innerHTML = "";
    if (jpgPreviewContainer) jpgPreviewContainer.innerHTML = "";
    if (jpgContinueBtn) jpgContinueBtn.disabled = true;
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
