const Category = require("../models/Category");

module.exports = {
  // CREATE
  async createCategory(req, res) {
    try {
      const { name } = req.body;

      const exists = await Category.findOne({ name });
      if (exists) return res.status(400).json({ message: "Category exists" });

      const category = await Category.create({ name });
      res.json(category);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET ALL
  async getCategories(req, res) {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // UPDATE
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const category = await Category.findById(id);
      if (!category) return res.status(404).json({ message: "Category not found" });

      category.name = name || category.name;
      await category.save();

      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) return res.status(404).json({ message: "Category not found" });

      await category.deleteOne();
      res.json({ message: "Category deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
