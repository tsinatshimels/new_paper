// --- Expanded Font Family Configuration ---
const fontFamilies = [
  // Serif Fonts
  { label: "Lora", value: "Lora" },
  { label: "Merriweather", value: "Merriweather" },
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "PT Serif", value: "PT Serif" },
  { label: "Roboto Slab", value: "Roboto Slab" },

  // Sans-Serif Fonts
  { label: "Lato", value: "Lato" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Open Sans", value: "Open Sans" },
  { label: "Oswald", value: "Oswald" },
  { label: "Poppins", value: "Poppins" },
  { label: "Raleway", value: "Raleway" },
  { label: "Roboto", value: "Roboto" },
  { label: "Work Sans", value: "Work Sans" },

  // Display Fonts
  { label: "Anton", value: "Anton" },
  { label: "Lobster", value: "Lobster" },
  { label: "Pacifico", value: "Pacifico" },
  { label: "Righteous", value: "Righteous" },

  // Handwriting Fonts
  { label: "Caveat", value: "Caveat" },
  { label: "Dancing Script", value: "Dancing Script" },
  { label: "Indie Flower", value: "Indie Flower" },
  { label: "Patrick Hand", value: "Patrick Hand" },

  // Monospace Fonts
  { label: "Inconsolata", value: "Inconsolata" },
  { label: "Roboto Mono", value: "Roboto Mono" },
  { label: "Source Code Pro", value: "Source Code Pro" },
];

const fontSizes = [
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "22px", value: "22px" },
  { label: "24px", value: "24px" },
  { label: "26px", value: "26px" },
  { label: "28px", value: "28px" },
  { label: "30px", value: "30px" },
  { label: "32px", value: "32px" },
  { label: "34px", value: "34px" },
  { label: "36px", value: "36px" },
];

// --- Dynamically Load Google Fonts ---
const googleFonts = fontFamilies.map((font) => font.value);
WebFont.load({
  google: {
    families: googleFonts,
  },
});

// --- Register Fonts with Quill ---
const Font = Quill.import("formats/font");
Font.whitelist = fontFamilies.map((family) => family.value);
Quill.register(Font, true);

// Register Custom Font Sizes
const Size = Quill.import("attributors/style/size");
Size.whitelist = fontSizes.map((size) => size.value);
Quill.register(Size, true);

document.addEventListener("DOMContentLoaded", () => {
  const sizemugFontFamilyBtn = document.querySelector(
    "div#sizemug_font_family--btn"
  );
  const sizemugFontSizeBtn = document.querySelector(
    "div#sizemug_font_size--btn"
  );

  // --- Populate Dropdowns with Font Samples ---
  fontFamilies.forEach((family) => {
    const markup = `
      <button class="dropdown-item" value="${family.value}">
        <span>${family.label}</span>
        <span class="font-sample" style="font-family: '${family.value}', sans-serif;">Aa</span>
      </button>`;
    sizemugFontFamilyBtn.insertAdjacentHTML("beforeend", markup);
  });

  fontSizes.forEach((size) => {
    const markup = `<button class="dropdown-item" value="${size.value}">${size.label}</button>`;
    sizemugFontSizeBtn.insertAdjacentHTML("beforeend", markup);
  });

  let focusedEditor = null;

  // Function to update toolbar state
  const updateToolbarState = (editor) => {
    if (!editor) return;

    const format = focusedEditor?.getFormat();

    // Update font family dropdown
    if (format.font) {
      sizemugFontFamilyBtn.value = format.font;
    } else {
      sizemugFontFamilyBtn.value = fontFamilies[0].value;
    }

    // Update font size dropdown
    if (format.size) {
      sizemugFontSizeBtn.value = format.size;
    } else {
      sizemugFontSizeBtn.value = "16px";
    }
  };

  // Track focused editor and update toolbar state
  paperEditors.forEach((editor) => {
    // Handle focus events
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;
      updateToolbarState(editor);
    });

    // Handle selection changes
    editor.on("selection-change", function (range) {
      if (editor === focusedEditor && range) {
        updateToolbarState(editor);
      }
    });

    // Handle text changes
    editor.on("text-change", function (delta, oldContents, source) {
      if (editor === focusedEditor) {
        updateToolbarState(editor);
      }
    });
  });

  // --- Change Font Family ---
  sizemugFontFamilyBtn.addEventListener("click", (e) => {
    if (!focusedEditor) return;

    // Find the button that was clicked
    const button = e.target.closest(".dropdown-item");
    if (!button) return;

    const family = button.value;
    const range = focusedEditor.getSelection();

    if (range) {
      focusedEditor.format("font", family);
    } else {
      focusedEditor.format("font", family, "user");
    }

    // Update toolbar state after format change
    updateToolbarState(focusedEditor);
  });

  // Change Font Size
  sizemugFontSizeBtn.addEventListener("click", (e) => {
    if (!focusedEditor) return;

    const button = e.target.closest(".dropdown-item");
    if (!button) return;

    const size = button.value;
    const range = focusedEditor.getSelection();

    if (range) {
      focusedEditor.format("size", size);
    } else {
      focusedEditor.format("size", size, "user");
    }

    // Update toolbar state after format change
    updateToolbarState(focusedEditor);
  });
});
