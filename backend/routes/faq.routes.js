const express = require("express");
const {
  getFAQs,
  getFaqByPK,
  createFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/faqs.controllers");
const { protect, admin } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(getFAQs).post(protect, admin, createFaq);
router
  .route("/:id")
  .get(getFaqByPK)
  .patch(protect, admin, updateFaq)
  .delete(protect, admin, deleteFaq);

module.exports = router;
