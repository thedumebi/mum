const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.utils");
const db = require("../models");
const User = db.User;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;

// @desc Auth user & get token
// @route POST /api/users/signin
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { input, password } = req.body;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const usernameRegex = /^[a-zA-Z][\w-]+$|^@[a-zA-Z0-9]*/;
  let criteria;

  if (emailRegex.test(input)) {
    criteria = { email: input };
  } else if (usernameRegex.test(input)) {
    if (input.startsWith("@")) {
      criteria = {
        username: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("username")),
          "LIKE",
          "%" + input.slice(1, input.length + 1).toLowerCase() + "%"
        ),
      };
    } else {
      criteria = {
        username: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("username")),
          "LIKE",
          "%" + input.toLowerCase() + "%"
        ),
      };
    }
  }

  const user = await User.findOne({ where: criteria });
  if (user) {
    if (await user.validPassword(password)) {
      const { password, ...otherKeys } = user.dataValues;
      res.status(200).json({
        ...otherKeys,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid password");
    }
  } else {
    if (criteria.email) {
      res.status(401);
      throw new Error("Invalid Email");
    } else if (criteria.username) {
      res.status(401);
      throw new Error("Invalid username");
    } else {
      res.status(401);
      throw new Error("No valid input");
    }
  }
});

// @desc Register User
// @route POST /api/users/signup
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    phoneNumber,
    firstName,
    lastName,
  } = req.body;

  const usernameExists = await User.findOne({
    where: {
      username: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("username")),
        "LIKE",
        `%${username.toLowerCase()}%`
      ),
    },
  });
  if (usernameExists) {
    res.status(400);
    throw new Error("Username already exists");
  } else {
    const emailExists = await User.findOne({
      where: { email },
    });
    if (emailExists) {
      res.status(400);
      throw new Error("Email is already in use");
    }

    const user = await User.create({
      username,
      password,
      email,
      phoneNumber,
      firstName,
      lastName,
    });
    if (user) {
      const { password, ...otherKeys } = user.dataValues;
      res.status(200).json({
        ...otherKeys,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

module.exports = {
  authUser,
  registerUser,
};
