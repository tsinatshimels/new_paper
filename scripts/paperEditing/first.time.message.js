const firstTimeMessage = document.getElementById("firstTimeMessage");
const gotItButton = document.getElementById("gotItButton");
const learnMoreButton = document.getElementById("learnMoreButton");

// Check if the user has visited before
const hasVisitedBefore = localStorage.getItem("firstTimeUser");

if (!hasVisitedBefore) {
  // If not, show the message
  if (firstTimeMessage) {
    firstTimeMessage.classList.remove("first-time--hidden");
  }

  // Set a flag in localStorage so it doesn't show again
  localStorage.setItem("firstTimeUser", "true");
  console.log("Set firstTimeUser in localStorage.");
} else {
  console.log("User has visited before. Not showing first time message.");
}

// Event listener for the "Got It" button
if (gotItButton) {
  gotItButton.addEventListener("click", () => {
    if (firstTimeMessage) {
      firstTimeMessage.classList.add("first-time--hidden");
    }
  });
}
