const asyncHandler = require("express-async-handler");
const fs = require("fs");
const db = require("../models");
const Item = db.Item;
const Category = db.Category;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;

// @desc Get all items
// @route GET /api/items/
// @access Public
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.findAll({ include: ["user", "categories"] });
  res.status(200).json(items);
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
  console.log(req.body);
  const { name, price, quantity, description, image, categories } = req.body;

  const itemCategories = await Category.findAll({
    where: {
      id: { [Op.in]: categories },
    },
  });
  console.log({ itemCategories });

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
    image,
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
    if (req.body.image) {
      try {
        fs.unlinkSync(item.image);
      } catch (error) {
        console.error(error);
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

module.exports = {
  getItems,
  getItemByPk,
  createItem,
  updateItem,
  deleteItem,
  getItemOfTheDay,
  addItem,
  removeItem,
};
