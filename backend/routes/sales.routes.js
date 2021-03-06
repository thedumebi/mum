const express = require("express");
const {
  getSales,
  getSalesForADay,
  getSaleByPk,
  makeSales,
  editSale,
  deleteSale,
} = require("../controllers/sales.controllers");
const { protect, admin } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(protect, admin, getSales).post(protect, admin, makeSales);
router.route("/today").get(protect, admin, getSalesForADay);
router
  .route("/:id")
  .get(protect, admin, getSaleByPk)
  .patch(protect, admin, editSale)
  .delete(protect, admin, deleteSale);

module.exports = router;
