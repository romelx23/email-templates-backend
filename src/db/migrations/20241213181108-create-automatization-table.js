'use strict';

const { AUTOMATION_TABLE } = require("../models/automatization.model");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(AUTOMATION_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      templateId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      userList: {
        allowNull: false,
        type: Sequelize.JSON, // Lista de usuarios como JSON
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Tabla referenciada
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      schedule: {
        allowNull: false,
        type: Sequelize.DATE, // Fecha y hora combinadas
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(AUTOMATION_TABLE);
  }
};
