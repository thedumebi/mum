const express = require("express");
const router = express.Router();
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
const { protect } = require("../middleware/auth.middleware");

router.route("/").get(getItems).post(createItem);
router.get("/item", getItemOfTheDay);
router.post("/:id/add", addItem);
router.post("/:id/remove"), removeItem;
router.route("/:id").get(getItemByPk).patch(updateItem).delete(deleteItem);

module.exports = router;
