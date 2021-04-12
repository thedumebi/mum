const ImageKit = require("imagekit");
const sharp = require("sharp");
const path = require("path");
const { promises: fs } = require("fs");
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
    await fs.unlink(file.path);
    return imgSrc;
  } catch (err) {
    console.log(err);
  }
};

const uploadToImageKit = (file, data, imgSrc) => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      { file: data, fileName: file.filename },
      async (err, result) => {
        if (err) return reject(err);
        try {
          await fs.unlink(imgSrc);
        } catch (err) {
          console.log(err);
        }
        return resolve(result);
      }
    );
  });
};

const sendToImageKit = async (file) => {
  try {
    const imgSrc = await resizeImages(file);
    const data = await fs.readFile(imgSrc);
    const result = await uploadToImageKit(file, data, imgSrc);
    return result;
    // imagekit.upload(
    //   {
    //     file: data,
    //     fileName: file.filename,
    //   },
    //   async (err, result) => {
    //     if (err) console.log(err);
    //     else {
    //       try {
    //         await fs.unlink(imgSrc);
    //         return result;
    //       } catch (err) {
    //         console.log(err);
    //       }
    //     }
    //   }
    // );
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendToImageKit;
