'use strict';

const { AUTOMATION_TABLE } = require("../models/automatization.model");

module.exports = {
  async up (queryInterface, Sequelize) {
      // // Agregar las nuevas columnas
      // await queryInterface.addColumn(AUTOMATION_TABLE, 'scheduleDate', {
      //   allowNull: false,
      //   type: Sequelize.DATEONLY, // Solo fecha
      // });
  
      // await queryInterface.addColumn(AUTOMATION_TABLE, 'scheduleTime', {
      //   allowNull: false,
      //   type: Sequelize.TIME, // Solo hora
      // });
  
      // // Migrar los datos de 'schedule' a 'scheduleDate' y 'scheduleTime'
      // await queryInterface.sequelize.query(`
      //   UPDATE "automations"
      //   SET "scheduleDate" = DATE("schedule"),
      //       "scheduleTime" = TIME("schedule")
      // `);
  
      // // Eliminar la columna antigua
      // await queryInterface.removeColumn(AUTOMATION_TABLE, 'schedule');
  },

  async down (queryInterface, Sequelize) {
  //  // Restaurar la columna antigua
  //  await queryInterface.addColumn(AUTOMATION_TABLE, 'schedule', {
  //   allowNull: false,
  //   type: Sequelize.DATE,
  // });

  // // Migrar los datos de 'scheduleDate' y 'scheduleTime' de vuelta a 'schedule'
  // await queryInterface.sequelize.query(`
  //   UPDATE "automations"
  //   SET "schedule" = "scheduleDate" + "scheduleTime"::interval
  // `);

  // // Eliminar las columnas nuevas
  // await queryInterface.removeColumn(AUTOMATION_TABLE, 'scheduleDate');
  // await queryInterface.removeColumn(AUTOMATION_TABLE, 'scheduleTime');
  }
};
