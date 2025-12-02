const router = require("express").Router();
const controller = require("../controllers/categoryController");
const protect = require('../middleware/protect');
const authorizeRoles = require('../middleware/authorizeRoles');

router.post("/", protect, authorizeRoles('admin'), controller.createCategory);
router.get("/", protect, authorizeRoles('admin'), controller.getCategories);
router.put("/:id", protect, authorizeRoles('admin'), controller.updateCategory);
router.delete("/:id", protect, authorizeRoles('admin'), controller.deleteCategory);

module.exports = router;
