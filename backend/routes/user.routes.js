const express = require("express");
const {
  registerUser,
  authUser,
  getUser,
  updateUser,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  ChangePassword,
} = require("../controllers/user.controllers");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router
  .route("/:id")
  .get(getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);
router.post("/:id/change-password", protect, ChangePassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
