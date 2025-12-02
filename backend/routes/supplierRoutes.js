// routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const protect = require("../middleware/protect");
const authorizeRoles = require("../middleware/authorizeRoles");
// Create supplier
// Create supplier (admin only)
router.post("/", protect, authorizeRoles("admin"), supplierController.createSupplier);

// Get all suppliers (admin only)
router.get("/", protect, authorizeRoles("admin"), supplierController.getSuppliers);

// Get one supplier (admin only)
router.get("/:id", protect, authorizeRoles("admin"), supplierController.getSupplier);

// Update supplier (admin only)
router.put("/:id", protect, authorizeRoles("admin"), supplierController.updateSupplier);

// Delete supplier (admin only)
router.delete("/:id", protect, authorizeRoles("admin"), supplierController.deleteSupplier);

module.exports = router;
