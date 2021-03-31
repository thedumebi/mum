const asyncHandler = require("express-async-handler");
const db = require("../models");
const Op = db.Sequelize.Op;
const fs = require("fs");
const Carousel = db.Carousel;

// @desc Get all carousels
// @route GET /api/carousel/
// @access Public
const getCarousels = asyncHandler(async (req, res) => {
  const carousels = await Carousel.findAll({ order: [["created_at", "DESC"]] });
  res.status(200).json(carousels);
});

// @desc Get a Carousel
// @route GET /api/carousel/:id
// @access Public
const getCarouselById = asyncHandler(async (req, res) => {
  const carousel = await Carousel.findByPk(req.params.id);
  if (carousel) {
    res.status(200).json(carousel);
  } else {
    res.status(404);
    throw new Error("Carousel not found");
  }
});

// @desc Create a new Carousel
// @route POST /api/carousel/
// @access Private
const createCarousel = asyncHandler(async (req, res) => {
  const { name, image, text, link } = req.body;
  const carouselExists = await Carousel.findOne({
    where: {
      name: { [Op.like]: `${name.toLowerCase()}` },
    },
  });
  if (carouselExists) {
    res.status(400);
    throw new Error("Sorry, you already have a carousel with that name");
  }

  const carousel = await Carousel.create({
    name,
    image,
    text,
    link,
  });
  if (carousel) {
    res.status(200).json(carousel);
  } else {
    throw new Error("Invalid Input");
  }
});

// @desc Update a Carousel
// @route PATCH /api/carousel/:id
// @access Private
const updateCarousel = asyncHandler(async (req, res) => {
  console.log(req.params);
  const { name } = req.body;

  if (name) {
    const carouselExists = await Carousel.findOne({
      where: {
        name: { [Op.like]: `${req.body.name.toLowerCase()}` },
      },
    });
    if (carouselExists) {
      res.status(400);
      throw new Error("Sorry, you already have a carousel item with that name");
    }
  }

  const carousel = await Carousel.findByPk(req.params.id);
  if (carousel) {
    if (req.body.image !== carousel.image) {
      try {
        fs.unlinkSync(carousel.image);
      } catch (error) {
        console.error(error);
      }
    }
    await carousel.update(req.body);
    res.status(200).json(carousel);
  } else {
    res.status(404);
    throw new Error("Carousel not found");
  }
});

// @desc    Delete Carousel
// @route   DELETE /api/carousel/:id
// @access  Private/Admin
const deleteCarousel = asyncHandler(async (req, res) => {
  const carousel = await Carousel.findByPk(req.params.id);
  if (carousel) {
    await carousel.destroy();
    res.status(200).json({ message: "Carousel Deleted" });
  } else {
    res.status(404);
    throw new Error("Carousel not found");
  }
});

module.exports = {
  getCarousels,
  getCarouselById,
  createCarousel,
  updateCarousel,
  deleteCarousel,
};
