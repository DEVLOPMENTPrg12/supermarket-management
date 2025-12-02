const router = require("express").Router();
const controller = require("../controllers/productController");
const protect = require('../middleware/protect');
const authorizeRoles = require('../middleware/authorizeRoles');

router.post("/",protect, authorizeRoles('admin'),  controller.createProduct);
router.get("/",protect, authorizeRoles('admin'),  controller.getProducts);
// Update Product
router.put("/:id", protect, authorizeRoles('admin'), controller.updateProduct);

// Delete Product
router.delete("/:id", protect, authorizeRoles('admin'), controller.deleteProduct);

// Optional: get single product
router.get("/:id", protect, authorizeRoles('admin'), controller.getProduct);

module.exports = router;


module.exports = router;
