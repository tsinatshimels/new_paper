document.addEventListener("DOMContentLoaded", () => {
  // --- Submenu Elements and Logic ---
  const convertElement = document.querySelector(".convert_document_element");
  const submenu = document.getElementById("converter-submenu");

  // --- Modal Elements ---
  const modal = document.getElementById("converter-modal");
  const step1 = document.getElementById("converter-step-1");
  const step2 = document.getElementById("converter-step-2");
  const step3 = document.getElementById("converter-step-3");
  const step4 = document.getElementById("converter-step-4");

  const selectFileBtn = document.getElementById("select-file-btn");
  const fileInput = document.getElementById("file-input");
  const selectedFileName = document.getElementById("selected-file-name");
  const cancelBtn = document.getElementById("cancel-btn");
  const continueBtn = document.getElementById("continue-btn");
  const backToStep1 = document.getElementById("back-to-step-1");
  const convertNowBtn = document.getElementById("convert-now-btn");
  const backToStep2 = document.getElementById("back-to-step-2");
  const downloadPdfBtn = document.getElementById("download-pdf-btn");

  let selectedFile = null;

  // --- Event Listener to Show/Hide the Submenu ---
  convertElement.addEventListener("click", (e) => {
    e.stopPropagation();
    // We only want to toggle the menu, not handle submenu clicks here

    submenu.classList.toggle("show");
  });

  // --- Event Listener for Submenu Item Clicks ---
  submenu.addEventListener("click", (e) => {
    e.stopPropagation();
    const action = e.target.dataset.action;
    if (action) {
      submenu.classList.remove("show"); // Hide submenu after selection

      if (action === "to-pdf") {
        // Launch the PDF conversion modal
        modal.style.display = "block";
        resetModal();
      } else if (action === "to-jpg") {
        // Placeholder for future functionality
        alert("Convert to JPG functionality coming soon!");
      } else if (action === "protect-pdf") {
        // Placeholder for future functionality
        alert("Protect PDF functionality coming soon!");
      }
    }
  });

  // --- Hide submenu if clicking outside ---
  window.addEventListener("click", (e) => {
    if (!convertElement.contains(e.target)) {
      submenu.classList.remove("show");
    }
  });

  // --- Modal Logic (largely the same as before) ---
  selectFileBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
      selectedFileName.textContent = `Selected: ${selectedFile.name}`;
      continueBtn.disabled = false;
    }
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  continueBtn.addEventListener("click", () => {
    step1.style.display = "none";
    step2.style.display = "block";
  });

  backToStep1.addEventListener("click", () => {
    step2.style.display = "none";
    step1.style.display = "block";
  });

  convertNowBtn.addEventListener("click", () => {
    step2.style.display = "none";
    step3.style.display = "block";
    simulateConversion();
  });

  backToStep2.addEventListener("click", () => {
    step4.style.display = "none";
    step2.style.display = "block";
  });

  downloadPdfBtn.addEventListener("click", () => {
    alert("Downloading PDF...");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Converted PDF from " + selectedFile.name, 10, 10);
    doc.save("converted-document.pdf");
  });

  function simulateConversion() {
    const progressBar = document.querySelector(".progress-bar");
    const progressPercentage = document.querySelector(".progress-percentage");
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        step3.style.display = "none";
        step4.style.display = "block";
      } else {
        width++;
        progressBar.style.width = width + "%";
        progressPercentage.textContent = width + "%";
      }
    }, 50);
  }

  function resetModal() {
    step1.style.display = "block";
    step2.style.display = "none";
    step3.style.display = "none";
    step4.style.display = "none";
    selectedFile = null;
    selectedFileName.textContent = "";
    continueBtn.disabled = true;
    fileInput.value = "";
    document.querySelector(".progress-bar").style.width = "0%";
    document.querySelector(".progress-percentage").textContent = "0%";
  }
});
