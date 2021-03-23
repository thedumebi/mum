const express = require("express");
const {
  registerUser,
  authUser,
  getUser,
  deleteUser,
} = require("../controllers/user.controllers");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.route("/:id").get(getUser).delete(protect, deleteUser);

module.exports = router;
