const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Purchase = require("../models/Purchase");

module.exports = {
  async salesReport(req, res) {
    const { period } = req.query; // daily, weekly, monthly
    try {
      // Example aggregation using MongoDB
      const groupBy = period === "daily" ? { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } :
                      period === "weekly" ? { $week: "$createdAt" } :
                      { $month: "$createdAt" };

      const data = await Sale.aggregate([
        { $group: { _id: groupBy, total: { $sum: "$totalAmount" } } },
        { $sort: { _id: 1 } }
      ]);

      res.json(data.map(d => ({ date: d._id, total: d.total })));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async stockReport(req, res) {
    try {
      const products = await Product.find();
      res.json(products.map(p => ({ product: p.name, quantity: p.quantity })));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async profitReport(req, res) {
    const { period } = req.query;
    try {
      // calculate profit = sale.totalAmount - cost (from purchases)
      const sales = await Sale.find();
      const purchases = await Purchase.find();

      // simple example, total profit
      let profit = 0;
      sales.forEach(s => {
        let cost = 0;
        s.items.forEach(item => {
          const purchaseItem = purchases.find(p => p.items.some(pi => pi.product.toString() === item.product.toString()));
          if (purchaseItem) {
            const pi = purchaseItem.items.find(i => i.product.toString() === item.product.toString());
            cost += pi ? pi.price * item.quantity : 0;
          }
        });
        profit += s.totalAmount - cost;
      });

      res.json([{ date: period, profit }]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
