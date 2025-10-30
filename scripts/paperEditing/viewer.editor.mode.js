document.addEventListener("DOMContentLoaded", () => {
  const dropdownSelect = document.querySelector(
    "#EditoToViewDropdown .dropdown-select"
  );
  const switchToEditorBtn = document.getElementById("switchToEditorButton");
  const switchToViewerBtn = document.getElementById("switchToViewerButton");
  const navbarWrapper = document.getElementById("navbar_header_tools--wrapper");
  const paperBoard = document.getElementById("main_white_paper_board");
  const dropdownButton = dropdownSelect.querySelector("button");
  const dropdownArrow = dropdownSelect.querySelectorAll("svg")[1]; // right arrow

  // Create a wrapper around your icon so we can safely replace it
  let iconWrapper = document.createElement("span");
  iconWrapper.classList.add("mode-icon");

  // Insert before button (first icon)
  const firstIcon = dropdownSelect.querySelector("svg");
  firstIcon.replaceWith(iconWrapper);

  // SVG icons for Editor and Viewer
  const editorIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#8837E9" stroke-linejoin="round" stroke-width="1.5"><path d="M13 20.827V22h1.173c.41 0 .614 0 .799-.076c.184-.076.328-.221.618-.51l4.823-4.825c.273-.273.41-.41.483-.556c.139-.28.139-.61 0-.89c-.073-.147-.21-.283-.483-.556s-.41-.41-.556-.483a1 1 0 0 0-.89 0c-.147.073-.284.21-.557.483l-4.823 4.824c-.29.289-.434.434-.51.618s-.077.388-.077.798Z"/><path stroke-linecap="round" d="M19 11s0-1.57-.152-1.937s-.441-.657-1.02-1.235l-4.736-4.736c-.499-.499-.748-.748-1.058-.896a2 2 0 0 0-.197-.082C11.514 2 11.161 2 10.456 2c-3.245 0-4.868 0-5.967.886a4 4 0 0 0-.603.603C3 4.59 3 6.211 3 9.456V14c0 3.771 0 5.657 1.172 6.828C5.235 21.892 6.886 21.99 10 22m2-19.5V3c0 2.828 0 4.243.879 5.121C13.757 9 15.172 9 18 9h.5"/></g></svg>
  `;

  const viewerIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#8837E9" stroke-linejoin="round" stroke-width="1"><path stroke-linecap="round" stroke-width="1.5" d="M19 13.005v-2.344c0-.818 0-1.227-.152-1.595s-.441-.657-1.02-1.235l-4.736-4.739c-.499-.499-.748-.748-1.058-.896a2 2 0 0 0-.197-.082C11.514 2 11.161 2 10.456 2c-3.245 0-4.868 0-5.967.886a4 4 0 0 0-.603.604C3 4.59 3 6.213 3 9.46v4.545c0 3.773 0 5.66 1.172 6.832C5.115 21.78 6.52 21.964 9 22m3-19.5V3c0 2.83 0 4.245.879 5.124c.878.879 2.293.879 5.121.879h.5"/><path stroke-width="1.5" d="M16 22c2.761 0 5-3 5-3s-2.239-3-5-3s-5 3-5 3s2.239 3 5 3Z"/><path stroke-linecap="round" stroke-width="2" d="M15.99 19H16"/></g></svg>
  `;

  // Function to set mode
  function setMode(mode) {
    if (mode === "viewer") {
      iconWrapper.innerHTML = viewerIcon;
      dropdownButton.textContent = "Viewer";
      navbarWrapper.style.display = "none";
      paperBoard.style.height = "calc(100dvh - 8.7rem)";
    } else {
      iconWrapper.innerHTML = editorIcon;
      dropdownButton.textContent = "Editor";
      navbarWrapper.style.display = "";
      paperBoard.style.height = "calc(100dvh - 15.7rem)";
    }
  }

  // Default mode = Editor
  setMode("editor");

  // Event listeners
  switchToEditorBtn.addEventListener("click", () => setMode("editor"));
  switchToViewerBtn.addEventListener("click", () => setMode("viewer"));
});
