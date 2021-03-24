"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("User", [
      {
        firstName: "Tessy",
        lastName: "Chiwuzoh",
        email: "tchiwuzoh@gmail.com",
        username: "Nkadi",
        password: bcrypt.hashSync("123456", 10),
        phoneNumber: "08022111180",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Daniel",
        lastName: "Chiwuzoh",
        email: "chiwuzohdumebi@gmail.com",
        username: "DMB",
        password: bcrypt.hashSync("123456", 10),
        phoneNumber: "08028611554",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("User", null, {});
  },
};
