const express = require("express");
const {
  getItems,
  createItem,
  getItemOfTheDay,
  addItem,
  removeItem,
  getItemByPk,
  updateItem,
  deleteItem,
} = require("../controllers/item.controllers");
const { protect, admin } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(getItems).post(protect, admin, createItem);
router.get("/item", getItemOfTheDay);
router.patch("/:id/add", protect, admin, addItem);
router.patch("/:id/remove", protect, admin, removeItem);
router
  .route("/:id")
  .get(getItemByPk)
  .patch(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
