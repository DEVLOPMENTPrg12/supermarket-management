// routes/purchaseRoutes.js
const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const protect = require("../middleware/protect");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create new purchase
// Create new purchase (admin only)
router.post("/", protect, authorizeRoles("admin"), purchaseController.createPurchase);

// Get all purchases (admin only)
router.get("/", protect, authorizeRoles("admin"), purchaseController.getPurchases);

// Get one purchase (admin only)
router.get("/:id", protect, authorizeRoles("admin"), purchaseController.getPurchase);

// Delete purchase (admin only)
router.delete("/:id", protect, authorizeRoles("admin"), purchaseController.deletePurchase);
// Update purchase (admin only)
router.put("/:id", protect, authorizeRoles("admin"), purchaseController.updatePurchase);


module.exports = router;
