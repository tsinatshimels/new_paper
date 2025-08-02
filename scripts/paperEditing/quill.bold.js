document.addEventListener("DOMContentLoaded", function () {
  const boldButton = document.getElementById("sizemug_bold--btn");

  boldButton.addEventListener("click", () => handleOnBold(focusedEditor));
});

function handleOnBold(editor) {
  const selection = editor?.getSelection();

  if (selection) {
    const format = editor?.getFormat(selection);
    editor.format("bold", !format.bold);
  } else {
    console.log("No text selected for bold.");
  }
}

// making a modal for mathematical Equations

document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // remove active-category class from all buttons
    document.querySelectorAll(".category-btn").forEach((button) => {
      button.classList.remove("active-category");
    });
    // add active-category class to the clicked button
    btn.classList.add("active-category");
    // const parent = btn.closest(".dropdown-category");
    // btn.classList.toggle(".active-category");
  });
});
