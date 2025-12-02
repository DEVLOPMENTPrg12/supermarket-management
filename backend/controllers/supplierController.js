const Supplier = require("../models/Supplier");

module.exports = {
  // -------------------------------
  // CREATE SUPPLIER
  // -------------------------------
  async createSupplier(req, res) {
    try {
      const supplier = await Supplier.create(req.body);
      res.json(supplier);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // GET ALL SUPPLIERS
  // -------------------------------
  async getSuppliers(req, res) {
    try {
      const suppliers = await Supplier.find().sort({ createdAt: -1 });
      res.json(suppliers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // GET ONE SUPPLIER
  // -------------------------------
  async getSupplier(req, res) {
    try {
      const supplier = await Supplier.findById(req.params.id);

      if (!supplier)
        return res.status(404).json({ message: "Supplier not found" });

      res.json(supplier);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // UPDATE SUPPLIER
  // -------------------------------
  async updateSupplier(req, res) {
    try {
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!supplier)
        return res.status(404).json({ message: "Supplier not found" });

      res.json(supplier);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // DELETE SUPPLIER
  // -------------------------------
  async deleteSupplier(req, res) {
    try {
      const supplier = await Supplier.findByIdAndDelete(req.params.id);

      if (!supplier)
        return res.status(404).json({ message: "Supplier not found" });

      res.json({ message: "Supplier deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
