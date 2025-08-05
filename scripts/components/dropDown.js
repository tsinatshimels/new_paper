class Dropdown {
  constructor(element) {
    this.dropdown = element;
    this.select = element.querySelector(".dropdown-select");
    this.menu =
      element.querySelector(".dropdown-menu:not(.paper--hidden)") ||
      element.querySelector(".dropdown-menu");
    this.selected = element.querySelector(".selected");
    this.items = element.querySelectorAll(".dropdown-item");
    element.dropdownInstance = this;
    this.select.addEventListener("click", () => this.toggle());
    this.items.forEach((item) => {
      item.addEventListener("click", () => this.selectOption(item));
    });
  }

  toggle() {
    const isOpen = this.menu.classList.contains("show");

    // Close all other dropdowns
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
      menu.classList.remove("show");
    });

    // Remove purple background from all trigger buttons
    document.querySelectorAll(".dropdown-select button").forEach((btn) => {
      btn.classList.remove("active-category");
    });

    document.querySelectorAll(".dropdown-select.open").forEach((select) => {
      select.classList.remove("open");
    });

    // Toggle current dropdown
    if (!isOpen) {
      this.menu.classList.add("show");
      this.select.classList.add("open");

      // ✅ Highlight the matematikalEquation button
      const mathBtn = this.select.querySelector("#matematicalEquation");
      if (mathBtn) {
        mathBtn.classList.add("active-category");
      }
    }
  }

  selectOption(itemElement) {
    // Clear previous selection and mark the clicked item as active
    this.items.forEach((item) => item.classList.remove("active"));
    itemElement.classList.add("active");

    // close the dropdown menu when one of the items is clicked
    this.menu.classList.remove("show");
    this.select.classList.remove("open");

    // Determine if the item contains only text
    const isTextOnly = false;
    // [...itemElement.childNodes].every(
    //   (node) => node.nodeType === Node.TEXT_NODE
    // );

    // this.selected.innerHTML = ""; // Clear previous content

    if (isTextOnly) {
      // Use textContent for performance if it's just text
      this.selected.textContent = itemElement.textContent;
    } else {
      // Otherwise, clone and append the full content
      const selectedContent = itemElement.cloneNode(true);
      // Remove event listeners from cloned nodes to avoid duplication
      selectedContent
        .querySelectorAll(".dropdown-item")
        .forEach((clonedItem) => {
          clonedItem.removeEventListener("click", () => {});
          clonedItem.onclick = null;
        });
      // this.selected.appendChild(selectedContent);
    }

    // this.menu.classList.remove("show");
    // this.select.classList.remove("open");
  }
}

// Initialize all dropdowns
document.querySelectorAll(".dropdown").forEach((dropdown) => {
  new Dropdown(dropdown);
});

// Close all dropdowns when clicking outside
document.addEventListener("click", function (event) {
  if (!event.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
      menu.classList.remove("show");
    });
    document.querySelectorAll(".dropdown-select.open").forEach((select) => {
      select.classList.remove("open");
    });
  }
});
