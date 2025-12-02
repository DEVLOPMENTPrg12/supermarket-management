const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const protect = require("../middleware/protect");
const authorizeRoles = require("../middleware/authorizeRoles");


// Sales report

// Sales report (admin only)
router.get("/sales",  reportController.salesReport);

// Stock report (admin only)
router.get("/stock",  reportController.stockReport);

// Profit report (admin only)
router.get("/profit",  reportController.profitReport);

module.exports = router;
