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

  // --- 1. Header with Word, Phonetic, and Audio Button ---
  const header = document.createElement("div");
  header.className = "dictionary-header";

  // Find the first phonetic that has an audio link
  const phoneticAudio = wordEntry.phonetics.find((p) => p.audio);
  const phoneticText = wordEntry.phonetics.find((p) => p.text)?.text || "";

  header.innerHTML = `
    <div class="word-title">
      <h3>${wordEntry.word}</h3>
      ${
        phoneticAudio
          ? `<button id="play-audio-btn" class="audio-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77c0-4.28-2.99-7.86-7-8.77"/></svg></button>`
          : ""
      }
    </div>
    <p class="phonetic-text">${phoneticText}</p>
  `;
  resultsContainer.appendChild(header);

  // Add event listener for the new audio button
  if (phoneticAudio) {
    const audioBtn = document.getElementById("play-audio-btn");
    const audio = new Audio(phoneticAudio.audio);
    audioBtn.addEventListener("click", () => {
      audio.play();
    });
  }

  // --- 2. Loop Through Meanings (Noun, Verb, etc.) ---
  wordEntry.meanings.forEach((meaning) => {
    const meaningDiv = document.createElement("div");
    meaningDiv.className = "word-section";

    // Part of speech as a styled badge
    meaningDiv.innerHTML = `<h4 class="part-of-speech">${meaning.partOfSpeech}</h4>`;

    const definitionsList = document.createElement("ol"); // Use an ordered list for numbering
    definitionsList.className = "definitions-list";

    meaning.definitions.forEach((def) => {
      const item = document.createElement("li");
      // Include the definition and an example sentence if it exists
      item.innerHTML = `
        <p class="definition">${def.definition}</p>
        ${def.example ? `<p class="example">“${def.example}”</p>` : ""}
      `;
      definitionsList.appendChild(item);
    });
    meaningDiv.appendChild(definitionsList);

    // --- 3. Synonyms as Clickable Tags ---
    if (meaning.synonyms && meaning.synonyms.length > 0) {
      const synonymsDiv = document.createElement("div");
      synonymsDiv.className = "synonyms-container";
      let synonymTags = meaning.synonyms
        .map((s) => `<span class="synonym-tag">${s}</span>`)
        .join("");
      synonymsDiv.innerHTML = `<strong>Synonyms:</strong> ${synonymTags}`;
      meaningDiv.appendChild(synonymsDiv);
    }

    resultsContainer.appendChild(meaningDiv);
  });
}
