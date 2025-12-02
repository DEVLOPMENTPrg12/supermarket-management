const Purchase = require("../models/Purchase");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product"); // تأكد عندك model ديال Product

module.exports = {
  // ------------------------------------
  // CREATE PURCHASE
  // ------------------------------------
  async createPurchase(req, res) {
    try {
      const { supplier, items } = req.body;

      if (!supplier) return res.status(400).json({ error: "Supplier is required" });
      if (!items || items.length === 0) return res.status(400).json({ error: "At least one item is required" });

      const itemsWithSubtotal = items.map((i) => ({
        product: i.product,
        quantity: Number(i.quantity),
        price: Number(i.price),
        subtotal: Number(i.quantity) * Number(i.price),
      }));

      const totalAmount = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);

      const purchase = await Purchase.create({
        supplier,
        items: itemsWithSubtotal,
        totalAmount,
      });

      await Supplier.findByIdAndUpdate(supplier, { $push: { purchases: purchase._id } });

      // تحديث stock
      for (const item of itemsWithSubtotal) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }

      res.json(purchase);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  },

  // ------------------------------------
  // UPDATE PURCHASE
  // ------------------------------------
  async updatePurchase(req, res) {
  try {
    const { items, supplier, status, note } = req.body;
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    // نرجعو stock القديم باش نحيدوه
    for (const oldItem of purchase.items) {
      if (oldItem.product) {
        await Product.findByIdAndUpdate(oldItem.product, { $inc: { stock: -oldItem.quantity } });
      }
    }

    // حساب subtotal الجديد
    const itemsWithSubtotal = items.map((i) => ({
      product: i.product,
      quantity: Number(i.quantity) || 0,
      price: Number(i.price) || 0,
      subtotal: (Number(i.quantity) || 0) * (Number(i.price) || 0),
    }));

    const totalAmount = itemsWithSubtotal.reduce((sum, i) => sum + i.subtotal, 0);

    // تحديث purchase
    purchase.items = itemsWithSubtotal;
    purchase.supplier = supplier || purchase.supplier;
    purchase.status = status || purchase.status;
    purchase.note = note || purchase.note;
    purchase.totalAmount = totalAmount;

    await purchase.save();

    // تحديث stock الجديد
    for (const item of itemsWithSubtotal) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }

    res.json(purchase);
  } catch (err) {
  console.error("UPDATE ERROR:", err.response?.data || err.message);
  alert("Error updating purchase! Check console for details.");
}

},


  // ------------------------------------
  // GET ALL PURCHASES
  // ------------------------------------
  async getPurchases(req, res) {
    try {
      const purchases = await Purchase.find()
        .populate("supplier", "name phone email")
        .populate("items.product", "name price SKU")
        .sort({ createdAt: -1 });

      res.json(purchases);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ------------------------------------
  // GET ONE PURCHASE
  // ------------------------------------
  async getPurchase(req, res) {
    try {
      const purchase = await Purchase.findById(req.params.id)
        .populate("supplier", "name phone email")
        .populate("items.product", "name price SKU");

      if (!purchase) return res.status(404).json({ message: "Purchase not found" });

      res.json(purchase);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ------------------------------------
  // DELETE PURCHASE
  // ------------------------------------
  async deletePurchase(req, res) {
    try {
      const purchase = await Purchase.findByIdAndDelete(req.params.id);

      if (!purchase) return res.status(404).json({ message: "Purchase not found" });

      // نخفض stock عند حذف purchase
      for (const item of purchase.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }

      res.json({ message: "Purchase deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
