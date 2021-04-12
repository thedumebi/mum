const ImageKit = require("imagekit");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const db = require("../models");
const Item = db.Item;

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

const resizeImages = async (file) => {
  // resize and compress with sharp
  const fileExt = path.extname(file.filename).toLowerCase();
  const imgSrc = `backend/uploads/${file.fieldname}-${Date.now()}${path.extname(
    file.filename
  )}`;
  try {
    if (fileExt === "jpg" || "jpeg") {
      await sharp(file.path)
        .jpeg({ quality: 100 })
        .rotate()
        .resize(1080, 1080, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toFile(imgSrc);
    } else if (fileExt === "png") {
      await sharp(file.path)
        .png({ quality: 100 })
        .rotate()
        .resize(1080, 1080, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toFile(imgSrc);
    }
    fs.unlink(file.path, (err) => {
      if (err) console.log(err);
    });
    return imgSrc;
  } catch (err) {
    console.log(err);
  }
};

const sendToImageKit = async (file, field, id) => {
  const imgSrc = await resizeImages(file);
  try {
    fs.readFile(imgSrc, (err, data) => {
      if (err) console.log(err);
      imagekit.upload(
        {
          file: data,
          fileName: file.filename,
        },
        (err, result) => {
          if (err) console.log(err);
          else {
            try {
              fs.unlink(imgSrc, (err) => {
                if (err) console.log(err);
              });
            } catch (err) {
              console.log(err);
            }
          }
          return result;
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendToImageKit;
