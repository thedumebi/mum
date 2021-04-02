const asyncHandler = require("express-async-handler");
const fs = require("fs");
const db = require("../models");
const imagekit = require("../utils/imageKit.utils");
const Item = db.Item;
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
const createItem = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    quantity,
    description,
    image1,
    image2,
    image3,
    categories,
  } = req.body;

  const itemCategories = await Category.findAll({
    where: {
      id: { [Op.in]: categories },
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
    image1,
    image2,
    image3,
  });
  if (item.price === undefined) {
    await item.update({ price: itemCategories[0].price });
  }
  await item.setUser(req.user);
  await item.addCategories(itemCategories);
  if (item) {
    res.status(200).json(item);
  } else {
    res.status(401);
    throw new Error("Invalid input");
  }
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
        await imagekit.deleteFile(item[`image${i}`]);
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
  await imagekit.deleteFile(image);
  // try {
  //   fs.unlinkSync(image);
  // } catch (error) {
  //   console.error(error);
  // }
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
};
