const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.utils");
const db = require("../models");
const User = db.User;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const nodemailer = require("nodemailer");

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

// @desc Get a User
// @route GET /api/users/:id
// @access Public
const getUser = asyncHandler(async (req, res) => {
  console.log(req.params);
  const user = await User.findByPk(req.params.id, {
    include: ["items"],
    attributes: { exclude: ["password"] },
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete User
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.status(200).json({ message: "User Deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc generate OTP
const generateOTP = async (length, args) => {
  const {
    digits = true,
    lowerCase = false,
    upperCase = false,
    specialChars = false,
  } = args;

  const numbers = "0123456789";
  const lowerAlphabets = "abcdefghijklmnopqrstuvwxyz";
  const upperAlphabets = lowerAlphabets.toUpperCase();
  const special = "!@#$%*";
  let OTP = "";

  let generateString = "";
  if (digits && lowerCase && upperCase && specialChars) {
    generateString = `${numbers}${lowerAlphabets}${upperAlphabets}${special}`;
  } else if (digits && lowerCase && upperCase) {
    generateString = `${numbers}${lowerAlphabets}${upperAlphabets}`;
  } else if (digits && lowerCase) {
    generateString = `${numbers}${lowerAlphabets}`;
  } else if (digits && upperCase) {
    generateString = `${numbers}${upperAlphabets}`;
  } else if (digits && specialChars) {
    generateString = `${numbers}${special}`;
  } else if (digits) {
    generateString = `${numbers}`;
  } else if (lowerCase && upperCase) {
    generateString = `${lowerAlphabets}${upperAlphabets}`;
  } else if (lowerCase && specialChars) {
    generateString = `${lowerAlphabets}${special}`;
  } else if (upperCase && specialChars) {
    generateString = `${upperAlphabets}${special}`;
  } else if (upperCase) {
    generateString = `${upperAlphabets}`;
  } else if (lowerCase) {
    generateString = `${lowerAlphabets}`;
  } else if (specialChars) {
    generateString = `${special}`;
  }

  for (let i = 0; i < length; i++) {
    OTP += generateString[Math.floor(Math.random() * generateString.length)];
  }

  return OTP;
};

// @desc Request password reset
// @route POST /api/users/request-password-reset
// @access Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    where: { email },
    attributes: { exclude: ["password"] },
  });
  if (user) {
    const OTP = await generateOTP(4, { upperCase: true });
    console.log({ OTP });
    const transporter = nodemailer.createTransport({
      host: "chiwuzoh.com.ng",
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: "chiwuzohdumebi@gmail.com",
      subject: "Reset Password",
      html: `<h1>Reset Password</h1>
      <p>Hello ${user.firstName},</p>
      <p>Your one time password is <strong>${OTP}</strong>. This expires in the next five (5) minutes</p>
      <p>Cheers,</p>
      <p>Tessy.</p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ user, OTP });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc save new password
// @route POST /user/reset-password
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
    attributes: { exclude: ["password", "uuid"] },
  });
  if (user) {
    await user.update({ password });
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  authUser,
  registerUser,
  getUser,
  deleteUser,
  requestPasswordReset,
  resetPassword,
};
