// Get references to DOM elements
const editorContainer = document.querySelector(".editor-container");
const editorPaper = document.getElementById("editor_paper");
const rulerSystem = document.getElementById("ruler-system-wrapper");
const zoomSlider = document.getElementById("zoom_level");
const zoomHandle = document.getElementById("zoom_handle");
const zoomFill = document.getElementById("zoom_fill");
const zoomLevelTracker = document.getElementById("zoom_level_tracker");

let scale = 1;
const minScale = 0.5;
const maxScale = 2;

// Function to update paper container size and position
function updatePaperContainer() {
  const editorContainerRect = editorContainer.getBoundingClientRect();
  const paperOriginalWidth = editorPaper.offsetWidth;

  // Apply scale to the paper container ONLY
  editorPaper.style.transform = `scale(${scale})`;
  editorPaper.style.transformOrigin = "top center";

  // Adjust paper container position to keep it centered
  const left = (editorContainerRect.width - paperOriginalWidth * scale) / 2;
  // editorPaper.style.left = `${Math.max(0, left)}px`;
  editorPaper.style.left = "0px";
  editorPaper.style.top = "0px";

  // Adjust editor container height to fit the scaled paper
  const paperScaledHeight = editorPaper.offsetHeight * scale;
  editorContainer.style.height = `${Math.max(
    editorContainerRect.height,
    paperScaledHeight
  )}px`;

  // Update zoom level display
  const zoomPercentage = Math.round(
    ((scale - minScale) / (maxScale - minScale)) * 100
  );
  zoomLevelTracker.textContent = `${zoomPercentage}%`;
  zoomFill.style.width = `${zoomPercentage}%`;
  zoomHandle.style.left = `${zoomPercentage}%`;

  // Dispatch a custom event with the new scale AND the paper's left position
  // The ruler script will use this to align itself perfectly.
  document.dispatchEvent(
    new CustomEvent("zoomchange", { detail: { scale: scale, paperLeft: left } })
  );
}

function setZoomFromMousePosition(clientX) {
  const rect = zoomSlider.getBoundingClientRect();
  const percentage = (clientX - rect.left) / rect.width;
  scale = minScale + percentage * (maxScale - minScale);
  scale = Math.max(minScale, Math.min(maxScale, scale));
  updatePaperContainer();
}

function dragHandler(e) {
  setZoomFromMousePosition(e.clientX);
}

zoomHandle.addEventListener("mousedown", function (e) {
  e.preventDefault();
  document.addEventListener("mousemove", dragHandler);
  document.addEventListener("mouseup", function () {
    document.removeEventListener("mousemove", dragHandler);
  });
});

zoomSlider.addEventListener("click", function (e) {
  if (e.target !== zoomHandle) {
    setZoomFromMousePosition(e.clientX);
  }
});

// Update paper container on window resize
window.addEventListener("resize", updatePaperContainer);

// Initial update
updatePaperContainer();
