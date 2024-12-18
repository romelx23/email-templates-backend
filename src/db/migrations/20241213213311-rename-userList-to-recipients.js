'use strict';

const { AUTOMATION_TABLE } = require("../models/automatization.model");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn(AUTOMATION_TABLE, 'userList', 'recipients');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn(AUTOMATION_TABLE, 'recipients', 'userList');
  }
};
