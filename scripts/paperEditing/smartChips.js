// smartChips.js

const smartChipsButton = document.getElementById("smartChups");
const dropdown = document.getElementById("smart-chips-dropdown");
const chipOptions = dropdown.querySelectorAll(".chip-option");

let activeChipNode = null;
let interactionModal = null;
let smartChipsInitialized = false;

// --- 1. Dropdown Toggle Logic ---
smartChipsButton.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("open");
});

document.addEventListener("click", () => {
  dropdown.classList.remove("open");
  closeChipInteractionModal();
  deselectChips();
});

dropdown.addEventListener("click", (e) => e.stopPropagation());

// --- 2. Helpers ---
function deselectChips() {
  document.querySelectorAll(".smart-chip-wrapper.selected").forEach((chip) => {
    chip.classList.remove("selected");
  });
}

function closeChipInteractionModal() {
  if (interactionModal) {
    interactionModal.remove();
    interactionModal = null;
  }
}

// --- 3. Event Delegation for Chip Clicks ---
function initializeChipClickHandler() {
  // Use event delegation on the editor root
  if (window.focusedEditor && window.focusedEditor.root) {
    window.focusedEditor.root.addEventListener("click", chipClickHandler);
  }
}

function chipClickHandler(e) {
  const clickedChip = e.target.closest(".smart-chip-wrapper");
  if (!clickedChip) return;

  e.stopPropagation();
  if (clickedChip.classList.contains("selected")) return;

  closeChipInteractionModal();
  deselectChips();

  clickedChip.classList.add("selected");
  activeChipNode = clickedChip;

  const chipType = clickedChip.dataset.chipType;
  const rect = clickedChip.getBoundingClientRect();
  const editorRect = window.focusedEditor.root.getBoundingClientRect();

  interactionModal = document.createElement("div");
  interactionModal.id = "chip-interaction-modal";
  interactionModal.className = "chip-interaction-modal";
  interactionModal.style.top = `${rect.bottom - editorRect.top + 5}px`;
  interactionModal.style.left = `${rect.left - editorRect.left}px`;
  interactionModal.addEventListener("click", (e) => e.stopPropagation());

  switch (chipType) {
    case "date":
      renderDateInteraction(interactionModal);
      break;
    case "event":
      renderEventInteraction(interactionModal);
      break;
    case "people":
      renderPeopleInteraction(interactionModal);
      break;
    case "place":
      renderPlaceInteraction(interactionModal);
      break;
  }

  window.focusedEditor.root.appendChild(interactionModal);
  interactionModal.style.display = "block";
}

// --- 4. Improved Update Chip ---
function updateChip(editor, chipNode, newLabel) {
  if (!chipNode || !editor) return;
  const quill = editor;

  // Get current chip data
  const chipType = chipNode.dataset.chipType;
  const currentIcon =
    chipNode.querySelector(".smart-chip-icon")?.innerHTML || "";

  const newData = {
    type: chipType,
    icon: currentIcon,
    display: newLabel,
    value: newLabel,
  };

  try {
    // Find the blot for the current chip
    const blot = Quill.find(chipNode);
    if (blot) {
      const index = quill.getIndex(blot);

      // Replace the chip
      quill.deleteText(index, 1, "user");
      quill.insertEmbed(index, "smart-chip", newData, "user");
      quill.insertText(index + 1, " ", "user");
      quill.setSelection(index + 2, 0, "user");
    }
  } catch (err) {
    console.error("Chip update failed:", err);
    // Fallback: direct DOM manipulation
    const labelElement = chipNode.querySelector(".smart-chip-label");
    if (labelElement) {
      labelElement.textContent = newLabel;
    }
    chipNode.dataset.value = newLabel;
  }

  closeChipInteractionModal();
  deselectChips();
}

// --- 5. Interaction Modals (keep these the same) ---
function renderDateInteraction(modal) {
  modal.innerHTML = `<div class="chip-modal-content"><input type="date" id="date-selector"></div>`;
  const dateSelector = modal.querySelector("#date-selector");

  dateSelector.addEventListener("change", (e) => {
    if (!e.target.value) return;
    const selectedDate = new Date(e.target.value);
    const displayFormat = selectedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    updateChip(window.focusedEditor, activeChipNode, displayFormat);
  });

  setTimeout(() => {
    try {
      dateSelector.showPicker();
    } catch {}
  }, 10);
}

function renderEventInteraction(modal) {
  const mockData = {
    public: [
      {
        name: "Quarterly Review",
        time: "8:00 – 10:00 AM",
        dot: "./icons/eventDot1.svg",
      },
      {
        name: "Client Presentation",
        time: "11:00 AM – 12:00 PM",
        dot: "./icons/eventDot1.svg",
      },
      {
        name: "Product Demo",
        time: "2:00 – 3:00 PM",
        dot: "./icons/eventDot2.svg",
      },
      {
        name: "Marketing Briefing",
        time: "4:00 – 4:45 PM",
        dot: "./icons/eventDot3.svg",
      },
    ],

    private: [
      {
        name: "Team Sync",
        time: "8:00 – 11:30 AM",
        dot: "./icons/eventDot2.svg",
      },
      {
        name: "Backend Strategy Call",
        time: "12:00 – 1:30 PM",
        dot: "./icons/eventDot2.svg",
      },
      {
        name: "Design Review Session",
        time: "3:15 – 4:15 PM",
        dot: "./icons/eventDot1.svg",
      },
      {
        name: "Hiring Committee Meeting",
        time: "5:00 – 6:00 PM",
        dot: "./icons/eventDot3.svg",
      },
    ],
  };

  modal.innerHTML = `<div class="chip-modal-content chip-modal-event">
    <div class="event-tabs">
      <button class="active" data-tab="public">Public</button>
      <button data-tab="private">Private</button>
    </div>
    <div class="chip-modal-search">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#000" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
    <input type="text"  placeholder="Search events...">
    </div>
    <div class="chip-modal-list" id="event-list"></div>
  </div>`;

  const eventList = modal.querySelector("#event-list");
  const searchInput = modal.querySelector(".chip-modal-search");
  const tabs = modal.querySelectorAll(".event-tabs button");
  let activeTab = "public";

  const renderList = (filter = "") => {
    eventList.innerHTML = "";
    mockData[activeTab]
      .filter((e) => e.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach((event) => {
        const item = document.createElement("div");
        item.className = "chip-modal-item";
        item.innerHTML = `<span><img src="${event.dot}" /></span><div class="event-detail"><small>${event.time}</small><strong>${event.name}</strong></div>`;
        item.addEventListener("click", () =>
          updateChip(window.focusedEditor, activeChipNode, event.name)
        );
        eventList.appendChild(item);
      });
  };

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.dataset.tab;
      renderList(searchInput.value);
    })
  );

  searchInput.addEventListener("input", () => renderList(searchInput.value));
  renderList();
  searchInput.focus();
}

function renderPeopleInteraction(modal) {
  modal.innerHTML = `<div class="chip-modal-content">
  <div class="chip-modal-search">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#000" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
    <input type="text"  placeholder="Search events...">
    </div>
    <div class="chip-modal-list" id="people-list">
      <div class="chip-modal-item-skeleton"></div>
      <div class="chip-modal-item-skeleton"></div>
    </div>
  </div>`;

  const peopleList = modal.querySelector("#people-list");

  fetch("https://randomuser.me/api/?results=10&seed=papersync")
    .then((res) => res.json())
    .then((data) => {
      peopleList.innerHTML = "";
      data.results.forEach((user) => {
        const fullName = `${user.name.first} ${user.name.last}`;
        const item = document.createElement("div");
        item.className = "chip-modal-item chip-modal-item-person";
        item.innerHTML = `<img src="${user.picture.thumbnail}" alt="${fullName}"> <span>${fullName}</span>`;
        item.addEventListener("click", () =>
          updateChip(window.focusedEditor, activeChipNode, fullName)
        );
        peopleList.appendChild(item);
      });
    })
    .catch(() => {
      peopleList.innerHTML = `<div class="chip-modal-error">Failed to load users.</div>`;
    });
}

function renderPlaceInteraction(modal) {
  const mockPlaces = [
    { capital: "Addis Ababa", country: "Ethiopia" },
    { capital: "Washington D.C.", country: "USA" },
    { capital: "London", country: "United Kingdom" },
    { capital: "Tokyo", country: "Japan" },
    { capital: "Paris", country: "France" },
    { capital: "Berlin", country: "Germany" },
    { capital: "Ottawa", country: "Canada" },
    { capital: "Canberra", country: "Australia" },
    { capital: "Nairobi", country: "Kenya" },
    { capital: "Cape Town", country: "South Africa" },
  ];
  modal.innerHTML = `<div class="chip-modal-content">
    <div class="chip-modal-search">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#000" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></svg>
    <input type="text"  placeholder="Search events...">
    </div>
    <div class="chip-modal-list" id="place-list"></div>
  </div>`;

  const searchInput = modal.querySelector(".chip-modal-search");
  const placeList = modal.querySelector("#place-list");

  const renderPlaces = (filter = "") => {
    placeList.innerHTML = "";
    mockPlaces.forEach(({ capital, country }) => {
      const item = document.createElement("div");
      item.className = "chip-modal-item chip-modal-item-place";
      item.innerHTML = `
          <div style="font-size: 12px; opacity: 0.7;">${capital}</div>
          <div style="font-weight: 600;">${country}</div>
        `;
      item.addEventListener("click", () =>
        updateChip(
          window.focusedEditor,
          activeChipNode,
          `${capital}, ${country}`
        )
      );
      placeList.appendChild(item);
    });
  };

  searchInput.addEventListener("input", (e) => renderPlaces(e.target.value));
  renderPlaces();
  searchInput.focus();
}

// --- 6. Initialize ---
function initializeChipFunctionality() {
  if (smartChipsInitialized) return;
  smartChipsInitialized = true;

  chipOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const chipType = option.dataset.chipType;
      const icon = option.querySelector("svg")?.outerHTML || "";
      const display = chipType.charAt(0).toUpperCase() + chipType.slice(1);

      if (window.focusedEditor) {
        const range = window.focusedEditor.getSelection(true);
        if (!range) return;

        if (range.length > 0)
          window.focusedEditor.deleteText(range.index, range.length, "user");

        const insertIndex = range.index;

        window.focusedEditor.insertEmbed(
          insertIndex,
          "smart-chip",
          { type: chipType, display, icon, value: display },
          "user"
        );
        window.focusedEditor.insertText(insertIndex + 1, " ", "user");
        window.focusedEditor.setSelection(insertIndex + 2, 0, "user");

        dropdown.classList.remove("open");
      }
      closeDropdownBar(); // close all dropdown
    });
  });

  // Initialize event delegation for chips
  initializeChipClickHandler();
}

// --- 7. Wait for editor ---
const checkEditor = setInterval(() => {
  if (window.focusedEditor && window.focusedEditor.root) {
    clearInterval(checkEditor);
    initializeChipFunctionality();
  }
}, 100);
