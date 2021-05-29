const express = require("express");
const {
  getSales,
  getSalesForADay,
  getSaleByPk,
} = require("../controllers/sales.controllers");
const { protect, admin } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(protect, admin, getSales);
router.route("/today").get(protect, admin, getSalesForADay);
router.route("/:id").get(protect, admin, getSaleByPk);

module.exports = router;
