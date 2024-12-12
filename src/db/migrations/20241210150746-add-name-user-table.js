'use strict';

const { USER_TABLE } = require("../models/user.model");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(USER_TABLE, 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Unnamed User',
    });
     // Opcional: Si no necesitas el valor por defecto después de la migración
     await queryInterface.changeColumn(USER_TABLE, 'name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(USER_TABLE, 'name');
  }
};
