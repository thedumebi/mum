const express = require("express");
const {
  registerUser,
  authUser,
  getUser,
  deleteUser,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/user.controllers");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.route("/:id").get(getUser).delete(protect, deleteUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
