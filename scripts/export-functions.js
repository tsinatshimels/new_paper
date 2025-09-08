// ===================================================================
//                PLACEHOLDER DATA GETTERS
// ===================================================================
// You MUST replace these functions with your actual application logic
// to get the data from your editor or sheet.
// ===================================================================

/**
 * Gets the content from your rich text editor (for Word/Docs mode).
 * @returns {string} The text content to be exported.
 */
function getEditorContent() {
  // EXAMPLE: If you are using a simple textarea with id="editor"
  // const editor = document.getElementById("editor");
  // return editor.value;

  // For now, returning placeholder content.
  return "This is the document title.\n\nThis is the first paragraph of the document. It contains some text that we want to export into various formats.";
}

/**
 * Gets the data from your sheet component as an array of arrays.
 * @returns {Array<Array<string>>} Data for sheet export.
 */
function getSheetDataAsArray() {
  // This should return your grid data, e.g., [["Name", "Age"], ["John", "30"]]
  // For now, returning placeholder data.
  return [
    ["Product", "Category", "Price", "Stock"],
    ["Laptop", "Electronics", 1200, 50],
    ["Book", "Literature", 25, 200],
    ["Coffee Mug", "Kitchenware", 15, 150],
  ];
}

// ===================================================================
//                      EXPORT FUNCTIONS
// ===================================================================

// --- Sheet Export Functions ---

/**
 * Handles exporting sheet data to CSV, XLS, or XLSX using the SheetJS library.
 * @param {'csv' | 'xls' | 'xlsx'} format - The desired file format.
 */
function exportSheetData(format) {
  const data = getSheetDataAsArray();
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const extension = format;
  const filename = `data-export.${extension}`;
  XLSX.writeFile(workbook, filename);
}

// --- Word/Docs Export Functions ---

/**
 * Exports content as a plain text (.txt) file.
 */
function exportAsTXT() {
  const content = getEditorContent();
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "document.txt");
}

/**
 * Exports content as a .doc file (a simple HTML wrapper).
 */
function exportAsDOC() {
  const content = getEditorContent().replace(/\n/g, "<br>");
  const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset='utf-8'></head>
        <body>${content}</body>
        </html>
    `;
  const blob = new Blob([htmlContent], { type: "application/msword" });
  saveAs(blob, "document.doc");
}

/**
 * Exports content as a .docx file using the docx library.
 */
function exportAsDOCX() {
  const content = getEditorContent();
  const doc = new docx.Document({
    sections: [
      {
        children: content
          .split("\n")
          .map(
            (text) => new docx.Paragraph({ children: [new docx.TextRun(text)] })
          ),
      },
    ],
  });

  docx.Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "document.docx");
  });
}

// --- Common Export Functions (PDF, XML) ---

/**
 * Exports content as a PDF file using the jsPDF library.
 * This function can be used for both Sheet and Word mode.
 */
function exportAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let content = "";

  // Check which mode we are in to get the right content
  if (window.currentEditorMode === "true") {
    // Docs mode
    content = getEditorContent();
    doc.text(content, 10, 10);
  } else {
    // Sheet mode
    const data = getSheetDataAsArray();
    content = data.map((row) => row.join("\t")).join("\n");
    doc.text(content, 10, 10);
    // For a more advanced table in PDF, you would use a plugin like jsPDF-AutoTable
  }

  doc.save("document.pdf");
}

/**
 * Exports content as a basic XML file.
 */
function exportAsXML() {
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';

  if (window.currentEditorMode === "true") {
    // Docs mode
    const content = getEditorContent();
    xmlContent += `<document>\n\t<content>${content}</content>\n</document>`;
  } else {
    // Sheet mode
    const data = getSheetDataAsArray();
    const headers = data[0];
    xmlContent += "<root>\n";
    data.slice(1).forEach((row) => {
      xmlContent += "\t<row>\n";
      headers.forEach((header, index) => {
        xmlContent += `\t\t<${header}>${row[index]}</${header}>\n`;
      });
      xmlContent += "\t</row>\n";
    });
    xmlContent += "</root>";
  }

  const blob = new Blob([xmlContent], {
    type: "application/xml;charset=utf-8",
  });
  saveAs(blob, "data.xml");
}
