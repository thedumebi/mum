"use strict";

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
        email: "tessychiwuzoh@gmail.com",
        username: "nkadi",
        password: "123456",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Daniel",
        lastName: "Chiwuzoh",
        email: "chiwuzohdumebi@gmail.com",
        username: "DMB",
        password: "123456",
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
