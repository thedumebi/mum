"use strict";
const moment = require("moment");

module.exports = {
  /**
   * @typedef {import ("sequelize").Sequelize} Sequelize
   * @typedef {import ("sequelize").QueryInterface} QueryInterface
   */

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    /**
     *
     *
     *
     *
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "Sales",
          "time",
          {
            type: Sequelize.BIGINT(11),
            defaultValue: moment().unix(),
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          "Sales",
          "time",
          {
            type: Sequelize.BIGINT(11),
            defaultValue: moment().unix(),
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
