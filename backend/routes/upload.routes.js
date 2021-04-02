const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const imagekit = require("../utils/imageKit.utils");
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
  // limits: { fileSize: 1024 * 1024 * 10 },
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
        // file size error
        return res.end("The maximum file size is 8mb");
      } else if (err) {
        // file type error
        return res.end(err.toString());
      } else {
        // const data = fs.readFileSync(
        //   path.join(__dirname, "..", "/uploads/" + req.file.filename)
        // );
        // const src = `data:${req.file.mimetype};base64,${data.toString(
        //   "base64"
        // )}`;

        // resize and compress with sharp
        const fileExt = path.extname(req.file.filename).toLowerCase();
        const imgSrc = `backend/uploads/${
          req.file.fieldname
        }-${Date.now()}${path.extname(req.file.filename)}`;
        if (fileExt === "jpg" || "jpeg") {
          await sharp(req.file.path)
            .jpeg({ quality: 100 })
            .rotate()
            .resize(1080, 1080, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .toFile(imgSrc);
        } else if (fileExt === "png") {
          await sharp(req.file.path)
            .png({ quality: 100 })
            .rotate()
            .resize(1080, 1080, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .toFile(imgSrc);
        }
        // delete original file uploaded
        try {
          fs.unlinkSync(req.file.path);
        } catch (error) {
          console.log(error);
        }
        // send to imageKit
        try {
          fs.readFile(imgSrc, (err, data) => {
            if (err) throw err;
            imagekit.upload(
              {
                file: data,
                fileName: `${req.file.fieldname}-${Date.now()}${path.extname(
                  req.file.filename
                )}`,
                folder: "/tessy",
              },
              (err, result) => {
                if (err) throw err;
                else console.log(result);
                res.json({ url: result.url, fileId: result.fileId });
              }
            );
          });
        } catch (error) {
          console.log(error);
        }
        // res.send(imgSrc);
      }
    });
  })
);

module.exports = router;
