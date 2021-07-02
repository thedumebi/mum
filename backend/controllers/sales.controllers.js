const db = require("../models");
const asyncHandler = require("express-async-handler");

const Sales = db.Sales;
const Op = db.Sequelize.Op;

// @desc Get all sales
// @route GET /api/sales/
// @access Admin
const getSales = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword;
  let where = {};
  if (keyword) {
    where = { name: { [Op.like]: `%${keyword}%` } };
  }

  const sales = await Sales.findAndCountAll({
    where: where,
    include: ["item"],
    limit: pageSize,
    offset: (page - 1) * pageSize,
    order: [["id", "DESC"]],
  });
  res.status(200).json({
    sales: sales.rows,
    page,
    pages: Math.ceil(sales.count / pageSize),
  });
});

// @desc Get sales of the day
// @route GET /api/sales/today
// @access Admin
const getSalesForADay = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword;
  const currentDate = new Date();
  const startTime = currentDate.setHours(0, 0, 0, 0);
  const endTime = Date.now();
  let where = {
    created_at: { [Op.between]: [startTime, endTime] },
  };
  if (keyword) {
    where = { [Op.and]: [where, { name: { [Op.like]: `%${keyword}%` } }] };
  }

  const sales = await Sales.findAndCountAll({
    where: where,
    include: ["item"],
    limit: pageSize,
    offset: (page - 1) * pageSize,
    order: [["id", "DESC"]],
  });
  res.status(200).json({
    sales: sales.rows,
    page,
    pages: Math.ceil(sales.count / pageSize),
  });
});

// @desc Get a Sale
// @route GET /api/sales/:id
// @access Admin
const getSaleByPk = asyncHandler(async (req, res) => {
  const sale = await Sales.findByPk(req.params.id, {
    include: [{ model: db.Item, as: "item", include: ["categories"] }],
  });
  if (sale) {
    res.status(200).json(sale);
  } else {
    res.status(404);
    throw new Error("Sale not found");
  }
});

module.exports = {
  getSales,
  getSalesForADay,
  getSaleByPk,
};