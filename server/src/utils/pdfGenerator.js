const PDFDocument = require("pdfkit");

exports.generatePDF = (title, content, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${title.replace(/\s+/g, "_")}.pdf`
  );

  doc.pipe(res);

  // Title
  doc
    .fontSize(20)
    .text(title, { align: "center" })
    .moveDown();

  // Content
  doc
    .fontSize(12)
    .text(content, {
      align: "left"
    });

  doc.end();
};
