const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");
const protect = require("../middleware/protect");
const authorizeRoles = require("../middleware/authorizeRoles");


// Create a new sale
// Create a new sale (admin only)
router.post("/", protect, authorizeRoles("admin"), saleController.createSale);

// Get all sales (admin only)
router.get("/", protect, authorizeRoles("admin"), saleController.getSales);

// Get one sale by ID (admin only)
router.get("/:id", protect, authorizeRoles("admin"), saleController.getSale);

// Delete a sale (admin only)
router.delete("/:id", protect, authorizeRoles("admin"), saleController.deleteSale);

// Search sales by client name or product name (admin only)
router.get("/search/query", protect, authorizeRoles("admin"), saleController.searchSales);


module.exports = router;
