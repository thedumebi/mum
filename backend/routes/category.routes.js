const express = require("express");
const {
  getCategories,
  getCategoryByPk,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controllers");
const { protect, admin } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(getCategories).post(protect, admin, createCategory);
router
  .route("/:id")
  .get(getCategoryByPk)
  .patch(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
