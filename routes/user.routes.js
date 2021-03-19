const express = require("express");
const { registerUser, authUser } = require("../controllers/user.controllers");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", authUser);

module.exports = router;
