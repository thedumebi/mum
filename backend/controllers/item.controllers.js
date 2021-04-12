const fs = require("fs");
const db = require("../models");
const multer = require("multer");
const imagekit = require("../utils/imageKit.utils");
const uploadFiles = require("../utils/multer.utils");
const asyncHandler = require("express-async-handler");
const sendToImageKit = require("../utils/imageKit.utils");

const Item = db.Item;
const User = db.User;
const Category = db.Category;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;

// @desc Get all items
// @route GET /api/items/
// @access Public
const getItems = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword;
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

  const items = await Item.findAndCountAll({
    where: where,
    include: [
      { model: db.User, as: "user", attributes: { exclude: ["password"] } },
      "categories",
    ],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
  res.status(200).json({
    items: items.rows,
    page,
    pages: Math.ceil(items.count / pageSize),
  });
});

// @desc Get an Item
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
        }

        const item = await Item.create({
          name,
          price,
          quantity,
          description,
          image1: image1 && image1[0].path,
          image2: image2 && image2[0].path,
          image3: image3 && image3[0].path,
        });
        if (item.price === undefined) {
          await item.update({ price: itemCategories[0].price });
        }
        await item.setUser(req.user);
        await item.addCategories(itemCategories);
        if (item) {
          if (image1) const imageKit1 = sendToImageKit(image1[0]);
          if (image2) const imageKit2 = sendToImageKit(image2[0]);
          if (image3) const imageKit3 = sendToImageKit(image3[0]);
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
const updateItem = asyncHandler(async (req, res) => {
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
    }
  }

  const item = await Item.findByPk(req.params.id);
  if (item) {
    for (let i = 1; i <= 3; i++) {
      if (
        req.body[`image${i}`] &&
        req.body[`image${i}`] !== item[`image${i}`]
      ) {
        if (item[`image${i}`] !== null) {
          await imagekit.deleteFile(item[`image${i}`].fileId);
        }
        //   try {
        //     fs.unlinkSync(item[`image${i}`]);
        //   } catch (error) {
        //     console.error(error);
        //   }
      }
    }
    const { categories, ...itemUpdate } = req.body;
    await item.update(itemUpdate);
    const itemCategories = await Category.findAll({
      where: {
        id: { [Op.in]: categories },
      },
    });
    await item.setCategories([]);
    await item.addCategories(itemCategories);

    res.status(200).json(item);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc    Delete Item
// @route   DELETE /api/items/:id
// @access  Private/Admin
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (item) {
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

  res.status(200).json(items[itemIndex]);
});

// @desc Add to an Item
// @route POST /api/items/:id/add
// @access Private
const addItem = asyncHandler(async (req, res) => {
  const { count } = req.body;
  const item = await Item.findByPk(req.params.id);
  if (item) {
    await item.increment(["quantity"], { by: count });
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
    await item.addUser(user);
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
    await item.removeUser(user);
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
};
