const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const db = require("../models");
const Item = db.Item;
const { admin, protect } = require("../middleware/auth.middleware");
const asyncHandler = require("express-async-handler");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Please select images only!!!", false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 8 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

router.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.end(err.toString());
      } else if (err) {
        return res.end(err.toString());
      } else {
        res.send(`${req.file.path}`);
      }
    });
  })
);

module.exports = router;
