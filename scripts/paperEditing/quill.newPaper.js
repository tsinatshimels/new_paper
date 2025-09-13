document.addEventListener("DOMContentLoaded", () => {
  const newFileButton = document.getElementById("sizemug_new_file--btn");
  const newPaperElement = document.querySelectorAll(".new_paper_element");

  [...newPaperElement, newFileButton].forEach((button) => {
    button.addEventListener("click", () => {
      createNewEditor();
      closeDropdownBar(); // close all dropdown
    });
  });

  const modeButton = document.querySelector(".mode_document_element");
  const modeOptions = document.querySelector(".mode_options");

  modeButton.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the click from propagating to the document
    modeOptions.style.display =
      modeOptions.style.display === "flex" ? "none" : "flex";
  });

  // Close the mode options when clicking outside
  document.addEventListener("click", () => {
    modeOptions.style.display = "none";
  });

  // Prevent closing when clicking inside the mode options
  modeOptions.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});
