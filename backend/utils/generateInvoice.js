const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * generateInvoice
 * @param {Object} sale - بيانات عملية البيع
 * @param {String} filename - اسم الفاتورة (مثلا invoice123.pdf)
 */
const generateInvoice = (sale, filename) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  const filePath = path.join(__dirname, filename);

  doc.pipe(fs.createWriteStream(filePath));

  // -------------------------------
  // Header
  // -------------------------------
  doc
    .fontSize(20)
    .text("Supermarket Invoice", { align: "center" })
    .moveDown();

  doc
    .fontSize(12)
    .text(`Invoice ID: ${sale._id}`)
    .text(`Client: ${sale.client.name}`)
    .text(`Date: ${new Date(sale.createdAt).toLocaleString()}`)
    .moveDown();

  // -------------------------------
  // Table Header
  // -------------------------------
  doc.fontSize(12);
  doc.text("Product", 50, doc.y, { continued: true });
  doc.text("Qty", 250, doc.y, { continued: true });
  doc.text("Price", 300, doc.y, { continued: true });
  doc.text("Subtotal", 400, doc.y);
  doc.moveDown();

  // -------------------------------
  // Table Items
  // -------------------------------
  sale.items.forEach((item) => {
    doc.text(item.product.name, 50, doc.y, { continued: true });
    doc.text(item.quantity, 250, doc.y, { continued: true });
    doc.text(item.price.toFixed(2), 300, doc.y, { continued: true });
    doc.text(item.subtotal.toFixed(2), 400, doc.y);
    doc.moveDown();
  });

  // -------------------------------
  // Total
  // -------------------------------
  doc
    .fontSize(14)
    .text(`Total: $${sale.totalAmount.toFixed(2)}`, { align: "right" });

  doc.end();

  return filePath;
};

module.exports = generateInvoice;
