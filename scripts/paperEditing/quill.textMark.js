document.addEventListener("DOMContentLoaded", function () {
  const sizemugTextMarkButton = document.getElementById(
    "sizemug_text_mark--btn"
  );
  const highlight = document.getElementById("sizemug_text_mark--btn--select");

  let focusedEditor = null;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;
    });
  });

  sizemugTextMarkButton.addEventListener("click", () =>
    handleTextMark(focusedEditor)
  );
  highlight.addEventListener("click", () =>
    highlightSelectedText(focusedEditor)
  );
});

function handleTextMark(editor) {
  const range = editor.getSelection();

  if (range) {
    const format = editor?.getFormat(range);

    if (format.highlight) {
      // Remove the highlight
      editor.formatText(range.index, range.length, "highlight", false);
    } else {
      // Apply the highlight with the specified color
      editor.formatText(range.index, range.length, "highlight", "yellow");
    }
  } else {
    console.log("User cursor is not in the editor.");
  }
}

function highlightSelectedText(editor) {
  const range = editor.getSelection();

  if (range) {
    const format = editor?.getFormat(range);

    if (format.highlight) {
      // Remove the highlight
      editor.formatText(range.index, range.length, "highlight", false);
    } else {
      // Apply the highlight with the specified color
      editor.formatText(range.index, range.length, "highlight", "orange");
    }
  } else {
    console.log("User cursor is not in the editor.");
  }
}
