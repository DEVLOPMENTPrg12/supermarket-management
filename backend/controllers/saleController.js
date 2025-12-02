const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Client = require("../models/Client");

module.exports = {
  // -------------------------------
  // CREATE SALE
  // -------------------------------
  async createSale(req, res) {
  try {
    const { client, items } = req.body;

    // 1️⃣ Check client
    const existingClient = await Client.findById(client);
    if (!existingClient)
      return res.status(404).json({ message: "Client not found" });

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Items array is empty or invalid" });

    // 2️⃣ Process items
    const itemsWithSubtotal = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Validate product id and quantity
      if (!item.product)
        return res.status(400).json({ message: `Item at index ${i} missing product id` });

      const qty = Number(item.quantity);
      if (isNaN(qty) || qty < 1)
        return res.status(400).json({ message: `Invalid quantity for product ${item.product}` });

      // Find product
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: `Product ${item.product} not found` });

      if (product.quantity < qty)
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });

      // Update stock
      product.quantity -= qty;
      await product.save();

      // Push processed item
      itemsWithSubtotal.push({
        product: product._id,
        quantity: qty,
        price: product.price,
        subtotal: qty * product.price,
      });
    }

    // 3️⃣ Calculate totalAmount
    const totalAmount = itemsWithSubtotal.reduce((sum, i) => sum + i.subtotal, 0);

    // 4️⃣ Create sale
    const sale = await Sale.create({
      client: existingClient._id,
      items: itemsWithSubtotal,
      totalAmount,
      paymentStatus: "paid",
    });

    res.json({ message: "Sale created successfully", sale });

  } catch (err) {
    console.error("Error in createSale:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
},

  // -------------------------------
  // GET ALL SALES
  // -------------------------------
  async getSales(req, res) {
    try {
      const sales = await Sale.find()
        .populate("client", "name")
        .populate("items.product", "name price") // 👈 زدنا price باش يحسب total
        .sort({ createdAt: -1 });

      res.json(sales);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // GET ONE SALE
  // -------------------------------
  async getSale(req, res) {
    try {
      const sale = await Sale.findById(req.params.id)
        .populate("client", "name")
        .populate("items.product", "name price"); // 👈 price باش يبان subtotal

      if (!sale) return res.status(404).json({ message: "Sale not found" });

      res.json(sale);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // DELETE SALE
  // -------------------------------
  async deleteSale(req, res) {
    try {
      const sale = await Sale.findByIdAndDelete(req.params.id);

      if (!sale) return res.status(404).json({ message: "Sale not found" });

      // عند حذف البيع، رجع الكمية للمنتجات
      await Promise.all(
        sale.items.map(async (i) => {
          const product = await Product.findById(i.product);
          if (product) {
            product.quantity += i.quantity;
            await product.save();
          }
        })
      );

      res.json({ message: "Sale deleted and stock updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // SEARCH SALES BY CLIENT OR PRODUCT
  // -------------------------------
  async searchSales(req, res) {
    try {
      const { q } = req.query;

      const sales = await Sale.find()
        .populate("client", "name")
        .populate("items.product", "name price"); // 👈 هنا كذلك price

      const filtered = sales.filter((sale) => {
        const clientMatch = sale.client.name.toLowerCase().includes(q.toLowerCase());
        const productMatch = sale.items.some(item =>
          item.product.name.toLowerCase().includes(q.toLowerCase())
        );
        return clientMatch || productMatch;
      });

      res.json(filtered);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
