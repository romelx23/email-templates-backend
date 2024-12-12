'use strict';

const { EMAIL_TABLE } = require("../models/email.model");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(EMAIL_TABLE, 'url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(EMAIL_TABLE, 'subject', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.addColumn(EMAIL_TABLE, 'content', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(EMAIL_TABLE, 'url');
    await queryInterface.removeColumn(EMAIL_TABLE, 'subject');
    await queryInterface.removeColumn(EMAIL_TABLE, 'content');
  }
};
