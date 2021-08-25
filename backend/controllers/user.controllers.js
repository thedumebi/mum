const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken.utils");
const db = require("../models");
const User = db.User;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const multer = require("multer");
const uploadFiles = require("../utils/multer.utils");
const transporter = require("../utils/nodemailer.utils");
const generateOTP = require("../utils/generateOTP.utils");
const { imagekit, sendToImageKit } = require("../utils/imageKit.utils");

// @desc Auth user & get token
// @route POST /api/users/signin
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { input, password } = req.body;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
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
  const { username, email, password, phoneNumber, firstName, lastName } =
    req.body;

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
    } else {
      const user = await User.create({
        username,
        password,
        email,
        phoneNumber,
        firstName,
        lastName,
      });
      if (user) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: "Welcome",
          html: `
          <p>Hello ${user.firstName},</p>
          <p>I am pleased to welcome you to my store. Be sure to check out our <a href="https://tessy.chiwuzoh.com.ng/items">Items</a>.</a></p>
          <p>Your outlook, our pride.</p>
          <p>Cheers,</p>
          <p>Dominion Fabrics.</p>`,
        };
        const info = await transporter.sendMail(mailOptions);
        const { password, ...otherKeys } = user.dataValues;
        if (info) {
          res.status(200).json({
            ...otherKeys,
            token: generateToken(user.id),
          });
        }
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    }
  }
});

// @desc Get Users
// @route GET /api/users/
// @access Private
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword;
  let where = {};
  if (keyword) {
    where = {
      [Op.or]: [
        { fullName: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
      ],
    };
  }

  const users = await User.findAndCountAll({
    where: where,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
  res.status(200).json({
    users: users.rows,
    page,
    pages: Math.ceil(users.count / pageSize),
  });
});

// @desc Get a User
// @route GET /api/users/:id
// @access Public
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: ["items", "favorites"],
    attributes: { exclude: ["password"] },
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update User
// @route   PATCH /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (username || email) {
    if (username) {
      const usernameExists = await User.findOne({
        where: {
          username: { [Op.like]: `${username.toLowerCase()}` },
        },
      });
      if (usernameExists) {
        res.status(400);
        throw new Error("Sorry, that username is not available");
      } else if (email) {
        const emailExists = await User.findOne({
          where: {
            email: { [Op.like]: `${email.toLowerCase()}` },
          },
        });
        if (emailExists) {
          res.status(400);
          throw new Error("Sorry, the provided email is not available");
        } else {
          const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
          });
          if (user) {
            await user.update(req.body);
            res
              .status(200)
              .json({ ...user.dataValues, token: generateToken(user.id) });
          } else {
            res.status(404);
            throw new Error("User not found");
          }
        }
      }
    }
  } else {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (user) {
      await user.update(req.body);
      res
        .status(200)
        .json({ ...user.dataValues, token: generateToken(user.id) });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
});

// @desc    Update User
// @route   PATCH /api/users/:id
// @access  Private/Admin
const ChangePassword = asyncHandler(async (req, res) => {
  const { old: oldPassword, new: newPassword } = req.body;
  const user = await User.findByPk(req.params.id);
  if (user) {
    if (await user.validPassword(oldPassword)) {
      await user.update({ password: newPassword });
      const { password, ...otherKeys } = user.dataValues;
      res.status(200).json(otherKeys);
    } else {
      res.status(401);
      throw new Error("Invalid password");
    }
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
    const OTP = generateOTP(4, { upperCase: true });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset Password",
      html: `<h1>Reset Password</h1>
      <p>Hello ${user.firstName},</p>
      <p>Your one time password is <strong>${OTP}</strong>. This expires in the next five (5) minutes</p>
      <p>Cheers,</p>
      <p>Dominion Fabrics.</p>`,
    };
    const info = await transporter.sendMail(mailOptions);

    if (info) res.status(200).json({ user, OTP });
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
    attributes: { exclude: ["password"] },
  });
  if (user) {
    await user.update({ password });
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc update user profile picture
// @route POST /user/profile-picture
// @access Private
const updateDP = asyncHandler(async (req, res, next) => {
  uploadFiles(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(400);
        throw new Error(err.message);
      } else if (err) {
        res.status(400);
        throw new Error(err.toString());
      } else {
        const user = await User.findByPk(req.params.id, {
          attributes: { exclude: ["password"] },
        });
        const defaultUrl =
          "https://ik.imagekit.io/msf9dwhbk3m/AC26972E-41EB-4318-877F-1ACBB7B32AC0_IMrRiKVMPG-t.jpeg";
        if (user) {
          const { image } = req.files;
          let update;
          if (image) update = await sendToImageKit(image[0]);
          else {
            update = {
              url: defaultUrl,
            };
          }
          if (
            user.profileImage.url !== defaultUrl &&
            user.profileImage.url !== update.url
          ) {
            await imagekit.deleteFile(user.profileImage.fileId);
          }
          await user.update({ profileImage: update });
          res
            .status(200)
            .json({ ...user.dataValues, token: generateToken(user.id) });
        } else {
          res.status(404);
          throw new Error("User not found");
        }
      }
    } catch (err) {
      next(err);
    }
  });
});

module.exports = {
  authUser,
  registerUser,
  getUsers,
  getUser,
  updateUser,
  ChangePassword,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  updateDP,
};
