'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('tasks', 'emails'); // Rename table
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('emails', 'tasks'); // Revert back if needed
  }
};
