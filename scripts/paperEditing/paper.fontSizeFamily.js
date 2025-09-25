document.addEventListener("DOMContentLoaded", () => {
  // --- Expanded Font Family Configuration ---
  const fontFamilies = [
    // Serif Fonts
    { label: "Lora", value: "Lora" },
    { label: "Merriweather", value: "Merriweather" },
    { label: "Playfair Display", value: "Playfair Display" },
    { label: "PT Serif", value: "PT Serif" },
    { label: "Roboto Slab", value: "Roboto Slab" },
    { label: "Alegreya", value: "Alegreya" },
    { label: "Cormorant Garamond", value: "Cormorant Garamond" },
    { label: "Libre Baskerville", value: "Libre Baskerville" },
    { label: "Neuton", value: "Neuton" },
    { label: "Source Serif Pro", value: "Source Serif Pro" },

    // Sans-Serif Fonts
    { label: "Lato", value: "Lato" },
    { label: "Montserrat", value: "Montserrat" },
    { label: "Open Sans", value: "Open Sans" },
    { label: "Oswald", value: "Oswald" },
    { label: "Poppins", value: "Poppins" },
    { label: "Raleway", value: "Raleway" },
    { label: "Roboto", value: "Roboto" },
    { label: "Work Sans", value: "Work Sans" },
    { label: "Inter", value: "Inter" },
    { label: "Nunito Sans", value: "Nunito Sans" },
    { label: "PT Sans", value: "PT Sans" },
    { label: "Source Sans Pro", value: "Source Sans Pro" },
    { label: "Barlow Condensed", value: "Barlow Condensed" },
    { label: "Cabin", value: "Cabin" },
    { label: "Fira Sans", value: "Fira Sans" },

    // Display Fonts
    { label: "Anton", value: "Anton" },
    { label: "Lobster", value: "Lobster" },
    { label: "Pacifico", value: "Pacifico" },
    { label: "Righteous", value: "Righteous" },
    { label: "Abril Fatface", value: "Abril Fatface" },
    { label: "Comfortaa", value: "Comfortaa" },
    { label: "Fredoka One", value: "Fredoka One" },
    { label: "Permanent Marker", value: "Permanent Marker" },
    { label: "Sacramento", value: "Sacramento" },
    { label: "Ultra", value: "Ultra" },

    // Handwriting Fonts
    { label: "Caveat", value: "Caveat" },
    { label: "Dancing Script", value: "Dancing Script" },
    { label: "Indie Flower", value: "Indie Flower" },
    { label: "Patrick Hand", value: "Patrick Hand" },
    { label: "Amatic SC", value: "Amatic SC" },
    { label: "Gochi Hand", value: "Gochi Hand" },
    { label: "Kalam", value: "Kalam" },
    { label: "Shadows Into Light", value: "Shadows Into Light" },

    // Monospace Fonts
    { label: "Inconsolata", value: "Inconsolata" },
    { label: "Roboto Mono", value: "Roboto Mono" },
    { label: "Source Code Pro", value: "Source Code Pro" },
    { label: "Space Mono", value: "Space Mono" },
    { label: "Cousine", value: "Cousine" },
    { label: "Ubuntu Mono", value: "Ubuntu Mono" },
  ];

  const fontSizes = [
    { label: "10", value: "10px" },
    { label: "12", value: "12px" },
    { label: "14", value: "14px" },
    { label: "16", value: "16px" },
    { label: "18", value: "18px" },
    { label: "20", value: "20px" },
    { label: "22", value: "22px" },
    { label: "24", value: "24px" },
    { label: "26", value: "26px" },
    { label: "28", value: "28px" },
    { label: "30", value: "30px" },
    { label: "32", value: "32px" },
    { label: "34", value: "34px" },
    { label: "36", value: "36px" },
  ];

  // --- Dynamically Load Google Fonts ---
  const googleFonts = fontFamilies.map((font) => font.value);
  if (window.WebFont) {
    window.WebFont.load({
      google: { families: googleFonts },
    });
  }

  // --- Register Custom Formats with Quill ---
  if (window.Quill) {
    // THIS IS THE FIX: Import the 'style' version of the font attributor
    const Font = Quill.import("attributors/style/font");
    Font.whitelist = fontFamilies.map((family) => family.value);
    Quill.register(Font, true);

    // This part for font size was already correct
    const Size = Quill.import("attributors/style/size");
    Size.whitelist = fontSizes.map((size) => size.value);
    Quill.register(Size, true);
  }

  // --- Get DOM Elements ---
  const sizemugFontFamilyDropdown = document.getElementById(
    "sizemug_font_family--btn"
  );
  const fontFamilySelect = document.getElementById("fontFamilySelect");
  const sizemugFontSizeBtn = document.getElementById("sizemug_font_size--btn");
  const fontSizeSelect = document.getElementById("fontSizeSelect");

  let focusedEditor = null;
  let selectionRange = null;

  // --- STATE VARIABLES TO REMEMBER LAST SELECTION ---
  let currentFontFamily = "Inter"; // Default font family
  let currentFontSize = "12px";

  const updateToolbarState = () => {
    if (!focusedEditor) return;
    const format = focusedEditor.getFormat() || {};

    if (format.font) {
      currentFontFamily = format.font;
    }
    const currentFont = fontFamilies.find((f) => f.value === currentFontFamily);
    if (currentFont) {
      fontFamilySelect.textContent = currentFont.label;
      fontFamilySelect.style.fontFamily = `'${currentFont.value}', sans-serif`;
    } else {
      // Fallback just in case
      fontFamilySelect.textContent = "Inter";
      fontFamilySelect.style.fontFamily = "'Inter', sans-serif";
    }
  };

  const updateFontSizeToolbar = () => {
    if (!focusedEditor) return;
    const format = focusedEditor.getFormat() || {};

    if (format.size) {
      currentFontSize = format.size;
    }
    const currentSize = fontSizes.find((s) => s.value === currentFontSize);
    if (currentSize) {
      fontSizeSelect.textContent = currentSize.label;
    } else {
      // Add a fallback to ensure the label resets
      fontSizeSelect.textContent = "12";
    }
  };

  // --- Populate Font Family Dropdown ---
  if (sizemugFontFamilyDropdown && fontFamilySelect) {
    fontFamilies.forEach((family) => {
      const markup = `
        <button class="dropdown-item" value="${family.value}">
          <span style="font-family: '${family.value}', sans-serif;">${family.label}</span>
        </button>`;
      sizemugFontFamilyDropdown.insertAdjacentHTML("beforeend", markup);
    });

    // sizemugFontFamilyDropdown.addEventListener("click", (e) => {
    //   if (!focusedEditor) return;
    //   const button = e.target.closest(".dropdown-item");
    //   if (!button) return;
    //   focusedEditor.format("font", button.value);
    //   updateToolbarState();
    // });
    sizemugFontFamilyDropdown.addEventListener("mousedown", (e) => {
      e.preventDefault(); // Prevent the editor from losing focus
      if (!focusedEditor) return;

      const button = e.target.closest(".dropdown-item");
      if (!button) return;

      // Restore selection before formatting
      if (selectionRange) {
        focusedEditor.setSelection(selectionRange);
      }
      const newFont = button.value;
      focusedEditor.format("font", newFont);
      currentFontFamily = newFont; // <<< UPDATE THE STATE VARIABLE
      updateToolbarState();
    });
  }

  // --- Populate and handle Font Size Dropdown ---
  if (sizemugFontSizeBtn) {
    fontSizes.forEach((size) => {
      const markup = `<button class="dropdown-item" value="${size.value}">${size.label}</button>`;
      sizemugFontSizeBtn.insertAdjacentHTML("beforeend", markup);
    });

    sizemugFontSizeBtn.addEventListener("mousedown", (e) => {
      e.preventDefault(); // Prevent the editor from losing focus
      if (!focusedEditor) return;

      const button = e.target.closest(".dropdown-item");
      if (!button) return;

      // Restore selection before formatting
      if (selectionRange) {
        focusedEditor.setSelection(selectionRange);
      }

      const newSize = button.value;
      focusedEditor.format("size", newSize);
      currentFontSize = newSize; // <<< UPDATE THE STATE VARIABLE
      updateFontSizeToolbar();
    });
  }

  // --- Editor Focus and Selection Tracking ---
  if (typeof paperEditors !== "undefined" && paperEditors.length > 0) {
    paperEditors.forEach((editor) => {
      editor.on("editor-change", (eventName, ...args) => {
        if (eventName === "selection-change") {
          const [range] = args;
          if (range) {
            selectionRange = range;
          }
          if (editor.hasFocus()) {
            focusedEditor = editor;
            updateToolbarState();
            updateFontSizeToolbar();
            if (editor.getLength() === 1) {
              editor.format("font", currentFontFamily);
              editor.format("size", currentFontSize);
            }
          }
        }
      });
    });
  }
});
