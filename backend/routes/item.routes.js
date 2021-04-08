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
  deleteImage,
  favoriteItem,
  unfavoriteItem,
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
router.post("/delete-image", protect, deleteImage);
router.post("/:id/favorite", protect, favoriteItem);
router.post("/:id/unfavorite", protect, unfavoriteItem);

module.exports = router;
