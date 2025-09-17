$(document).ready(function () {
  const $rotationMenu = $("#text-rotation-menu");
  const $customAngleSelect = $("#customAngleSelect");

  // --- Main Click Handler for Preset Rotation Buttons ---
  $rotationMenu.on("click", ".dropdown-item", function () {
    const rotationType = $(this).attr("id");

    // Reset the custom angle dropdown for a cleaner UI
    $customAngleSelect.val("");

    applyRotation(rotationType);
  });

  // --- Handler for Custom Angle Dropdown ---
  $customAngleSelect.on("change", function () {
    const angle = $(this).val();
    if (angle !== "") {
      // Ensure a valid angle is selected
      applyRotation("custom", angle);
    }
  });

  /**
   * Applies the selected rotation style to the currently selected cells.
   * @param {string} type The ID of the button that was clicked or 'custom'.
   * @param {number|null} customAngle The angle for custom rotation.
   */
  function applyRotation(type, customAngle = null) {
    const selectedRange = getSelectedRange();
    if (!selectedRange) {
      alert("Please select a cell or range first.");
      return;
    }

    let transformValue = "none";
    let whiteSpaceValue = "nowrap"; // Default for most
    let writingModeValue = "horizontal-tb"; // Default

    switch (type) {
      case "rotate-none":
        // Defaults are already set
        break;
      case "rotate-tilt-up":
        transformValue = "rotate(-45deg)";
        break;
      case "rotate-tilt-down":
        transformValue = "rotate(45deg)";
        break;
      case "rotate-stack-vertical":
        whiteSpaceValue = "normal";
        writingModeValue = "vertical-rl";
        transformValue = "rotate(180deg)"; // Flips the vertical text to read top-to-bottom
        break;
      case "rotate-up":
        transformValue = "rotate(-90deg)";
        break;
      case "rotate-down":
        transformValue = "rotate(90deg)";
        break;
      case "custom":
        if (customAngle !== null) {
          transformValue = `rotate(${customAngle}deg)`;
        }
        break;
      default:
        return; // Exit if type is unknown
    }

    // Apply the styles to every cell in the selected range
    for (let r = selectedRange.minRow; r <= selectedRange.maxRow; r++) {
      for (let c = selectedRange.minCol; c <= selectedRange.maxCol; c++) {
        $(`div.cell[data-row=${r}][data-col=${c}]`).css({
          transform: transformValue,
          "white-space": whiteSpaceValue,
          "writing-mode": writingModeValue,
        });
      }
    }
  }
});
