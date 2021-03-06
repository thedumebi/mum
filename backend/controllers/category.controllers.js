const asyncHandler = require("express-async-handler");
const db = require("../models");
const Category = db.Category;
const Item = db.Item;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;

// @desc Get all categories
// @route GET /api/categories/
// @access Public
const getCategories = asyncHandler(async (req, res) => {
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

  const categories = await Category.findAndCountAll({
    where: where,
    order: [["created_at", "DESC"]],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
  res.status(200).json({
    categories: categories.rows,
    page,
    pages: Math.ceil(categories.count / pageSize),
  });
});

// @desc Get all categories - no pagination
// @route GET /api/categories/all
// @access Public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).json(categories);
});

// @desc Get a Category
// @route GET /api/categories/:id
// @access Public
const getCategoryByPk = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id, {
    include: [
      {
        model: Item,
        as: "items",
      },
    ],
    order: [["items", "id", "DESC"]],
  });
  if (category) {
    res.status(200).json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc Create a new Category
// @route POST /api/categories/
// @access Private
const createCategory = asyncHandler(async (req, res) => {
  const { name, price, description } = req.body;

  const categoryExists = await Category.findOne({
    where: {
      name: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        "LIKE",
        `%${name.toLowerCase()}%`
      ),
    },
  });
  if (categoryExists) {
    res.status(400);
    throw new Error("Sorry, you already have a category with that name");
  } else {
    const category = await Category.create({
      name,
      price,
      description,
    });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(400);
      throw new Error("Invalid input");
    }
  }
});

// @desc Update a category
// @route PATCH /api/categories/:id
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (name) {
    const categoryExists = await Category.findOne({
      where: {
        name: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("name")),
          "LIKE",
          `${name.toLowerCase()}`
        ),
      },
    });

    if (categoryExists) {
      res.status(400);
      throw new Error("Sorry, you already have a category with that name");
    } else {
      const category = await Category.findByPk(req.params.id);
      if (category) {
        const updatedCategory = await category.update(req.body);
        if (req.body.setPrice && req.body.setPrice === true) {
          const items = await Item.findAll({
            include: [
              {
                model: Category,
                as: "categories",
                required: true,
                through: {
                  where: {
                    categoryId: { [Op.eq]: category.id },
                  },
                },
              },
            ],
          });
          for (var item of items) {
            item.update({ price: category.price });
          }
        }
        res.status(200).json(updatedCategory);
      } else {
        res.status(404);
        throw new Error("Category not found");
      }
    }
  } else {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      const updatedCategory = await category.update(req.body);
      if (req.body.setPrice && req.body.setPrice === true) {
        const items = await Item.findAll({
          include: [
            {
              model: Category,
              as: "categories",
              required: true,
              through: {
                where: {
                  categoryId: { [Op.eq]: category.id },
                },
              },
            },
          ],
        });
        for (var item of items) {
          item.update({ price: category.price });
        }
      }
      res.status(200).json(updatedCategory);
    } else {
      res.status(404);
      throw new Error("Category not found");
    }
  }
});

// @desc    Delete Category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (category) {
    category.destroy();
    res.status(200).json({ message: "Category Deleted" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

module.exports = {
  getCategories,
  getAllCategories,
  getCategoryByPk,
  createCategory,
  updateCategory,
  deleteCategory,
};
