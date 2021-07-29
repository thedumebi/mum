const fs = require("fs");
const db = require("../models");
const multer = require("multer");
const uploadFiles = require("../utils/multer.utils");
const asyncHandler = require("express-async-handler");
const { imagekit, sendToImageKit } = require("../utils/imageKit.utils");

const Item = db.Item;
const User = db.User;
const Sales = db.Sales;
const Op = db.Sequelize.Op;
const Category = db.Category;
const sequelize = db.sequelize;

// @desc Get all items
// @route GET /api/items/
// @access Public
const getItems = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword;

  const c = req.query.categories;
  let categoriesList = null;
  if (c) {
    const categories = Object.keys(req.query.categories);
    const categoriesArray = categories.map(async (name) => {
      const category = await Category.findOne({
        where: { name },
        attributes: ["id"],
      });
      return category.id;
    });
    categoriesList = await Promise.all(categoriesArray);
  }

  let where = {};
  if (keyword) {
    where = {
      [Op.or]: [
        {
          name: { [Op.like]: `%${keyword}%` },
        },
        { description: { [Op.like]: `%${keyword}%` } },
      ],
    };
  }
  const p = req.query.prices;
  if (p) {
    const prices = Object.keys(req.query.prices);
    const pricesArray = prices.map((price) => {
      const priceSplit = price.split("-");
      let arr = [];
      priceSplit.forEach((p) => {
        if (Number(p)) {
          arr.push(Number(p));
        }
      });
      return arr;
    });
    const pricesList = pricesArray.flat(1);
    const pricesMin = Math.min(...pricesList);
    const pricesMax = Math.max(...pricesList);

    where = {
      [Op.and]: [where, { price: { [Op.between]: [pricesMin, pricesMax] } }],
    };
  }

  const items = await Item.findAndCountAll({
    where: where,
    include: [
      { model: db.User, as: "user", attributes: { exclude: ["password"] } },
      {
        model: db.Category,
        as: "categories",
        ...(c && {
          required: true,
          through: { where: { categoryId: { [Op.in]: categoriesList } } },
        }),
      },
    ],
    limit: pageSize,
    offset: (page - 1) * pageSize,
    order: [["id", "DESC"]],
  });

  res.status(200).json({
    items: items.rows,
    page,
    pages: Math.ceil(items.count / pageSize),
  });
});

// @desc Get all items - no pagination
// @route GET /api/items/all
// @access Public
const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.findAll({ order: [["id", "DESC"]] });
  res.status(200).json(items);
});

// @desc Get an Ite
// @route GET /api/items/:id
// @access Public
const getItemByPk = asyncHandler(async (req, res) => {
  const item = await Item.findByPk(req.params.id, {
    include: ["user", "categories"],
  });
  if (item) {
    res.status(200).json(item);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc Create a new Item
// @route POST /api/items/
// @access Private
const createItem = asyncHandler(async (req, res, next) => {
  uploadFiles(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        // file size error
        res.status(400);
        throw new Error(err.message);
      } else if (err) {
        // file type error
        res.status(400);
        throw new Error(err.toString());
      } else {
        // no error
        const { name, price, quantity, description, categories } = req.body;
        const { image1, image2, image3 } = req.files;
        const categoriesArray = categories.split(",");

        const itemCategories = await Category.findAll({
          where: {
            id: { [Op.in]: categoriesArray },
          },
        });

        const item = await Item.create({
          name,
          price,
          quantity,
          description,
        });
        if (
          (item.price === undefined || item.price === "") &&
          itemCategories.length > 0
        ) {
          await item.update({ price: itemCategories[0].price });
        }
        await item.setUser(req.user);
        await item.addCategories(itemCategories);
        if (item) {
          let imageKit1, imageKit2, imageKit3;
          if (image1) imageKit1 = sendToImageKit(image1[0]);
          if (image2) imageKit2 = sendToImageKit(image2[0]);
          if (image3) imageKit3 = sendToImageKit(image3[0]);
          const [result1, result2, result3] = await Promise.all([
            imageKit1,
            imageKit2,
            imageKit3,
          ]);
          await item.update({
            image1: result1,
            image2: result2,
            image3: result3,
          });
          res.status(200).json(item);
        } else {
          res.status(401);
          throw new Error("Invalid input");
        }
      }
    } catch (err) {
      next(err);
    }
  });
});

// @desc Update an Item
// @route PATCH /api/items/:id
// @access Private
const updateItem = asyncHandler(async (req, res, next) => {
  uploadFiles(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        // file size error
        res.status(400);
        throw new Error(err.message);
      } else if (err) {
        // file type error
        res.status(400);
        throw new Error(err.toString());
      } else {
        // no error
        const { image1, image2, image3 } = req.files;
        const { name } = req.body;

        if (name) {
          const itemExists = await Item.findOne({
            where: {
              name: sequelize.where(
                sequelize.fn("LOWER", sequelize.col("name")),
                "LIKE",
                `${name.toLowerCase()}`
              ),
            },
          });
          if (itemExists) {
            res.status(400);
            throw new Error("Sorry, you already have an item with that name!");
          } else {
            const item = await Item.findByPk(req.params.id);
            if (item) {
              const {
                categories,
                image1: oldImage1,
                image2: oldImage2,
                image3: oldImage3,
                ...itemUpdate
              } = req.body;
              await item.update(itemUpdate);
              const categoriesArray = categories.split(",");
              const itemCategories = await Category.findAll({
                where: {
                  id: { [Op.in]: categoriesArray },
                },
              });
              await item.setCategories([]);
              await item.addCategories(itemCategories);

              let imageKit1, imageKit2, imageKit3;
              if (image1) imageKit1 = sendToImageKit(image1[0]);
              if (image2) imageKit2 = sendToImageKit(image2[0]);
              if (image3) imageKit3 = sendToImageKit(image3[0]);
              const [result1, result2, result3] = await Promise.all([
                imageKit1,
                imageKit2,
                imageKit3,
              ]);

              // delete image
              for (let i = 1; i < 4; i++) {
                if (item[`image${i}`] !== null) {
                  if (
                    (!req.files[`image${i}`] && !req.body[`image${i}`]) ||
                    req.files[`image${i}`]
                  ) {
                    console.log(i, "deleted");
                    await imagekit.deleteFile(item[`image${i}`].fileId);
                    item[`image${i}`] = null;
                    await item.save();
                  }
                }
              }

              if (result1) {
                await item.update({ image1: result1 });
              }
              if (result2) {
                await item.update({ image2: result2 });
              }
              if (result3) {
                await item.update({ image3: result3 });
              }

              res.status(200).json(item);
            } else {
              res.status(404);
              throw new Error("Item not found");
            }
          }
        } else {
          const item = await Item.findByPk(req.params.id);
          if (item) {
            const {
              categories,
              image1: oldImage1,
              image2: oldImage2,
              image3: oldImage3,
              ...itemUpdate
            } = req.body;
            await item.update(itemUpdate);
            const categoriesArray = categories.split(",");
            const itemCategories = await Category.findAll({
              where: {
                id: { [Op.in]: categoriesArray },
              },
            });
            await item.setCategories([]);
            await item.addCategories(itemCategories);

            let imageKit1, imageKit2, imageKit3;
            if (image1) imageKit1 = sendToImageKit(image1[0]);
            if (image2) imageKit2 = sendToImageKit(image2[0]);
            if (image3) imageKit3 = sendToImageKit(image3[0]);
            const [result1, result2, result3] = await Promise.all([
              imageKit1,
              imageKit2,
              imageKit3,
            ]);

            // delete image
            for (let i = 1; i < 4; i++) {
              if (item[`image${i}`] !== null) {
                if (
                  (!req.files[`image${i}`] && !req.body[`image${i}`]) ||
                  req.files[`image${i}`]
                ) {
                  console.log(i, "deleted");
                  await imagekit.deleteFile(item[`image${i}`].fileId);
                  item[`image${i}`] = null;
                  await item.save();
                }
              }
            }

            if (result1) {
              await item.update({ image1: result1 });
            }
            if (result2) {
              await item.update({ image2: result2 });
            }
            if (result3) {
              await item.update({ image3: result3 });
            }

            res.status(200).json(item);
          } else {
            res.status(404);
            throw new Error("Item not found");
          }
        }
      }
    } catch (err) {
      next(err);
    }
  });
});

// @desc    Delete Item
// @route   DELETE /api/items/:id
// @access  Private/Admin
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (item) {
    await item.setFavorites([]);
    await item.setCategories([]);
    await item.destroy();

    res.status(200).json({ message: "Item Deleted" });
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc    Get Item of the day
// @route   GET /api/items/item
// @access  Public
const getItemOfTheDay = asyncHandler(async (req, res) => {
  const items = await Item.findAll();
  const msPerDay = 24 * 60 * 60 * 1000; //number of milliseconds in a day
  let daysSinceEpoch = Math.floor(new Date().getTime() / msPerDay); //number of days since jan 1, 1970
  let itemIndex = daysSinceEpoch % items.length;
  let itemOfTheDay = items[itemIndex] || {};

  res.status(200).json(itemOfTheDay);
});

// @desc Add to an Item
// @route POST /api/items/:id/add
// @access Private
const addItem = asyncHandler(async (req, res) => {
  const { count } = req.body;
  const item = await Item.findByPk(req.params.id);
  if (item) {
    if (item.quantity !== null && item.quantity !== undefined) {
      await item.increment(["quantity"], { by: count });
    } else {
      await item.update({ quantity: count });
    }
    await item.reload();
    res.status(200).json(item);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc Remove from an Item
// @route POST /api/items/:id/remove
// @access Private
const removeItem = asyncHandler(async (req, res) => {
  const { count } = req.body;
  const item = await Item.findByPk(req.params.id);
  if (item) {
    await item.decrement(["quantity"], { by: count });
    await item.reload();
    res.status(200).json(item);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc Delete Item image
// @route POST /api/items/delete-image
// @access Private
const deleteImage = asyncHandler(async (req, res) => {
  const { image } = req.body;
  await imagekit.deleteFile(image.fileId);
  // try {
  //   fs.unlinkSync(image);
  // } catch (error) {
  //   console.error(error);
  // }
});

// @desc Favorite an Item
// @route POST /api/items/:id/favorite
// @access Private
const favoriteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (item) {
    const user = await User.findByPk(req.body.userId, {
      include: ["items", "favorites"],
      attributes: { exclude: ["password"] },
    });
    await item.addFavorites(user);
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc unfavorite an Item
// @route POST /api/items/:id/unfavorite
// @access Private
const unfavoriteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (item) {
    const user = await User.findByPk(req.body.userId, {
      include: ["items", "favorites"],
      attributes: { exclude: ["password"] },
    });
    await item.removeFavorites(user);
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

module.exports = {
  getItems,
  getItemByPk,
  createItem,
  updateItem,
  deleteItem,
  getItemOfTheDay,
  addItem,
  removeItem,
  deleteImage,
  favoriteItem,
  unfavoriteItem,
  getAllItems,
};
