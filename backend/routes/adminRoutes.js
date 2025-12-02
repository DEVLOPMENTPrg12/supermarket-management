// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Product = require("../models/Product");
const Sale = require("../models/Sale");

// -------------------------
// MAIN DASHBOARD STATS
// -------------------------
// MAIN DASHBOARD STATS
// routes/adminRoutes.js
router.get(
  "/dashboard",
  
  // ghir admin
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      const lowStock = await Product.countDocuments({ stock: { $lt: 10 } });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dailySales = await Sale.countDocuments({ createdAt: { $gte: today } });
      const salesToday = await Sale.find({ createdAt: { $gte: today } });
      let dailyRevenue = 0;
      salesToday.forEach((sale) => (dailyRevenue += Number(sale.totalAmount)));
      const totalSales = await Sale.countDocuments();

      res.json({
        stats: { totalUsers, totalProducts, lowStock, dailySales, dailyRevenue, totalSales },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// SALES CHART (last 7 days)
router.get("/chart/sales",   async (req, res) => {
  try {
    const last7Days = [];
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      last7Days.push(day);
    }

    for (let i = 0; i < 7; i++) {
      const dayStart = last7Days[i];
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const sales = await Sale.find({ createdAt: { $gte: dayStart, $lt: dayEnd } });
      let total = 0;
      sales.forEach((s) => (total += Number(s.totalAmount)));

      labels.push(dayStart.toISOString().split("T")[0]);
      data.push(total);
    }

    res.json({ labels, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// STOCK CHART
router.get("/chart/stock",   async (req, res) => {
  try {
    const products = await Product.find();

    const labels = products.map((p) => p.name);
    const data = products.map((p) => p.stock);

    res.json({ labels, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
