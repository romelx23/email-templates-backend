'use strict';

const { EMAIL_TABLE } = require('../models/email.model');

module.exports = {
  async up(queryInterface, Sequelize) {
    // // Agregar columna con allowNull true temporalmente
    // await queryInterface.addColumn(EMAIL_TABLE, 'userId', {
    //   type: Sequelize.INTEGER,
    //   allowNull: true, // Temporalmente permitimos valores nulos
    //   references: {
    //     model: 'users',
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // });

    // // Opcional: Actualizar registros existentes con un valor predeterminado
    // await queryInterface.sequelize.query(`
    //   UPDATE ${EMAIL_TABLE}
    //   SET userId = 1 -- Cambiar a un ID de usuario válido o NULL si prefieres
    //   WHERE userId IS NULL
    // `);

    // // Modificar la columna para no permitir valores nulos
    // await queryInterface.changeColumn(EMAIL_TABLE, 'userId', {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'users',
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // });
  },

  async down(queryInterface) {
    // await queryInterface.removeColumn(EMAIL_TABLE, 'userId');
  }
};