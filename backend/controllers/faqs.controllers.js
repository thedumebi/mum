const asyncHandler = require("express-async-handler");
const db = require("../models");
const FAQs = db.FAQs;
const Op = db.Sequelize.Op;

// @desc Get all faqs
// @route GET /api/faqs/
// @access Public
const getFAQs = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword;
  let where = {};
  if (keyword) {
    where = {
      [Op.or]: [
        {
          question: { [Op.like]: `%${keyword}%` },
        },
        { answer: { [Op.like]: `%${keyword}%` } },
      ],
    };
  }

  const faqs = await FAQs.findAndCountAll({
    where: where,
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
  console.log({ faqs });
  res.status(200).json({
    faqs: faqs.rows,
    page,
    pages: Math.ceil(faqs.count / pageSize),
  });
});

// @desc Get a Faq
// @route GET /api/faqs/:id
// @access Public
const getFaqByPK = asyncHandler(async (req, res) => {
  const faq = await FAQs.findByPk(req.params.id);
  if (faq) {
    res.status(200).json(faq);
  } else {
    res.status(404);
    throw new Error("FAQ not found");
  }
});

// @desc Create a new faq
// @route POST /api/faqs/
// @access Private
const createFaq = asyncHandler(async (req, res) => {
  const { question, answer } = req.body;

  const faq = await FAQs.create({
    question,
    answer,
  });
  if (faq) {
    res.status(200).json(faq);
  } else {
    res.status(400);
    throw new Error("Invalid input");
  }
});

// @desc Update faq
// @route PATCH /api/faqs/:id
// @access Private
const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FAQs.findByPk(req.params.id);
  if (faq) {
    const updatedFaq = await faq.update(req.body);
    res.status(200).json(updatedFaq);
  } else {
    res.status(404);
    throw new Error("FAQ not found");
  }
});

// @desc Delete Faq
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await FAQs.findByPk(req.params.id);
  if (faq) {
    faq.destroy();
    res.status(200).json({ message: "FAQ deleted" });
  } else {
    res.status(404);
    throw new Error("FAQ not found");
  }
});

module.exports = {
  getFAQs,
  getFaqByPK,
  createFaq,
  updateFaq,
  deleteFaq,
};
