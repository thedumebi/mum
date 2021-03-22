const express = require("express");
const {
  registerUser,
  authUser,
  getUser,
} = require("../controllers/user.controllers");

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/:id", getUser);

module.exports = router;
