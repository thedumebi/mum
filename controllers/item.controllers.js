const asyncHandler = require("express-async-handler");
const db = require("../models");
const Item = db.Item;
const sequelize = db.sequelize;

// @desc Get all items
// @route GET /api/items/
// @access Public
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.findAll();
  res.status(200).json(items);
});

// @desc Get an Item
// @route GET /api/items/:id
// @access Public
const getItemByPk = asyncHandler(async (req, res) => {
  const item = await Item.findByPk(req.params.id);
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
  const { name, price, quantity, description, image } = req.body;

  const itemExists = await Item.findOne({
    where: {
      name: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        "LIKE",
        `%${name.toLowerCase()}%`
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
  item.setUser(req.user);
  if (item) {
    res.status(200).json(item);
  } else {
    res.status(401);
    throw new Error("invalid input");
  }
});

// @desc Update an Item
// @route PATCH /api/items/:id
// @access Private
const updateItem = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const itemExists = await Item.findOne({
    where: {
      userId: req.user.dataValues.id,
      name: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        "LIKE",
        `%${name.toLowerCase()}%`
      ),
    },
  });
  if (itemExists) {
    res.status(400);
    throw new Error("Sorry, you already have an item with that name!");
  }

  const item = await Item.findOne({
    where: { id: req.params.id, userId: req.user.dataValues.id },
  });
  if (item) {
    const updatedItem = await item.update(req.body);
    res.status(200).json(updatedItem);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc    Delete Item
// @route   DELETE /api/items/:id
// @access  Private/Admin
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findOne({
    where: { id: req.params.id, userId: req.user.dataValues.id },
  });
  if (item) {
    item.destroy();
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
  const item = await Item.findOne({
    where: { id: req.params.id, userId: req.user.dataValues.id },
  });
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
  const item = await Item.findOne({
    where: { id: req.params.id, userId: req.user.dataValues.id },
  });
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
