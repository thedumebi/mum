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
  getUsers,
} = require("../controllers/user.controllers");
const { protect, admin } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(protect, admin, getUsers).post(registerUser);
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
