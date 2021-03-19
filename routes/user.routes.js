const express = require("express");
const {
  registerUser,
  authUser,
  getUser,
} = require("../controllers/user.controllers");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", authUser);
router.get("/:id", getUser);

module.exports = router;
