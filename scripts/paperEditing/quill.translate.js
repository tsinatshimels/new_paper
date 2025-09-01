const translateBtn = document.getElementById("translate-btn");
const translateModal = document.getElementById("translate-modal");
const cancelTranslateBtn = document.getElementById("cancel-translate");
const confirmTranslateBtn = document.getElementById("confirm-translate");
const languageSelect = document.getElementById("language-select");

let sourceLanguage = "en"; // Let's track the current language, default is English

translateBtn.addEventListener("click", () => {
  translateModal.style.display = "flex";
  closeDropdownBar(); // close all dropdown
});

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

cancelTranslateBtn.addEventListener("click", () => {
  translateModal.style.display = "none";
});

confirmTranslateBtn.addEventListener("click", () => {
  const targetLanguage = languageSelect.value;
  const textToTranslate = window.focusedEditor.getText();

  if (textToTranslate.trim()) {
    // Pass both the source and target language to the function
    translateText(textToTranslate, sourceLanguage, targetLanguage);
  }
  translateModal.style.display = "none";
});

async function translateText(text, sourceLang, targetLang) {
  // If the source and target languages are the same, do nothing.
  if (sourceLang === targetLang) {
    return;
  }

  const encodedText = encodeURIComponent(text);
  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Translation request failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    const translatedText = data.responseData.translatedText;

    if (translatedText) {
      // *** THIS IS THE KEY CHANGE ***
      // Instead of creating a new editor, we get the current one and replace its content.
      if (window.focusedEditor) {
        // Get the current scroll position before setting new text
        const editorScroller = window.focusedEditor.scrollingContainer;
        const scrollTop = editorScroller.scrollTop;

        // Replace the text in the current editor
        window.focusedEditor.setText(translatedText);

        // Restore the scroll position
        editorScroller.scrollTop = scrollTop;

        // Update the source language for the next translation
        sourceLanguage = targetLang;
      } else {
        console.error("No editor is currently focused.");
        alert("Could not perform translation: no editor selected.");
      }
    } else {
      throw new Error("Could not find translated text in the API response.");
    }
  } catch (error) {
    console.error("Translation Error:", error);
    alert(
      "Failed to translate the document. Please check the console for errors."
    );
  }
}
