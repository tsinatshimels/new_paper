const dictionaryBtn = document.getElementById("dictionary-btn");
const dictionarySidebar = document.getElementById("dictionary-sidebar");
const closeDictionaryBtn = document.getElementById("close-dictionary");
const searchInput = document.getElementById("dictionary-search");
const resultsContainer = document.getElementById("dictionary-results");

// Debounce function to limit how often API is called
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

dictionaryBtn.addEventListener("click", () => {
  dictionarySidebar.style.right = "0";
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

closeDictionaryBtn.addEventListener("click", () => {
  dictionarySidebar.style.right = "-350px";
});

// Call the debounced function on keyup
searchInput.addEventListener(
  "keyup",
  debounce((event) => {
    const searchTerm = event.target.value.trim();
    // Only search for words with 2 or more characters
    if (searchTerm.length > 1) {
      fetchWordDefinition(searchTerm);
    } else {
      resultsContainer.innerHTML = `<p class="initial-message">Start typing to search for a word.</p>`;
    }
  }, 500) // Wait for 500ms after user stops typing
);

async function fetchWordDefinition(word) {
  resultsContainer.innerHTML = `<p>Searching for "${word}"...</p>`;
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) {
      resultsContainer.innerHTML = `<p>No definition found for "${word}". Please check your spelling.</p>`;
      return;
    }
    const data = await response.json();
    displayDefinition(data);
  } catch (error) {
    console.error("Dictionary Error:", error);
    resultsContainer.innerHTML =
      "<p>Could not fetch the definition. Please try again later.</p>";
  }
}

function displayDefinition(data) {
  resultsContainer.innerHTML = ""; // Clear previous results
  const wordEntry = data[0];

  // Display word and phonetic
  const header = document.createElement("div");
  header.innerHTML = `<h3>${wordEntry.word}</h3>
                        <p>${
                          wordEntry.phonetics.find((p) => p.text)?.text || ""
                        }</p>`;
  resultsContainer.appendChild(header);

  // Display meanings
  wordEntry.meanings.forEach((meaning) => {
    const meaningDiv = document.createElement("div");
    meaningDiv.className = "word-section";
    meaningDiv.innerHTML = `<h4>${meaning.partOfSpeech}</h4>`;

    const definitionsList = document.createElement("ul");
    meaning.definitions.forEach((def) => {
      const item = document.createElement("li");
      item.textContent = def.definition;
      definitionsList.appendChild(item);
    });
    meaningDiv.appendChild(definitionsList);

    if (meaning.synonyms && meaning.synonyms.length > 0) {
      const synonyms = document.createElement("p");
      synonyms.innerHTML = `<strong>Synonyms:</strong> ${meaning.synonyms.join(
        ", "
      )}`;
      meaningDiv.appendChild(synonyms);
    }

    resultsContainer.appendChild(meaningDiv);
  });
}
