const Product = require("../models/Product");
const Category = require("../models/Category");

module.exports = {
  // ---------------- CREATE PRODUCT ----------------
  async createProduct(req, res) {
    try {
      const {
        name,
        description,
        price,
        category,
        quantity,
        image,
        SKU,
        status,
        brand,
        tags,
      } = req.body;

      const cat = await Category.findById(category);
      if (!cat) return res.status(404).json({ message: "Category not found" });

      const product = await Product.create({
        name,
        description,
        price,
        category,
        quantity,
        image,
        SKU,
        status,
        brand,
        tags,
      });

      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ---------------- GET ALL PRODUCTS ----------------
  async getProducts(req, res) {
    try {
      const products = await Product.find()
        .populate("category", "name")
        .sort({ createdAt: -1 });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ---------------- GET SINGLE PRODUCT ----------------
  async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id).populate(
        "category",
        "name"
      );
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ---------------- UPDATE PRODUCT ----------------
  async updateProduct(req, res) {
    try {
      const {
        name,
        description,
        price,
        category,
        quantity,
        image,
        SKU,
        status,
        brand,
        tags,
      } = req.body;

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          price,
          category,
          quantity,
          image,
          SKU,
          status,
          brand,
          tags,
        },
        { new: true }
      );

      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ---------------- DELETE PRODUCT ----------------
  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Product deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
