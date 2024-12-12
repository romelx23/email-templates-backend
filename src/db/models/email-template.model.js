const { Model, DataTypes, Sequelize } = require('sequelize');

const EmailTemplateSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  url: { // Nuevo campo
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  },
};

const EMAILTEMPLATE_TABLE = 'tasks';

class EmailTemplate extends Model {

  static associate(models) { // eslint-disable-line
    //
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: EMAILTEMPLATE_TABLE,
      modelName: 'Task',
      timestamps: true
    }
  }
}

module.exports = { EmailTemplate, EmailTemplateSchema, EMAILTEMPLATE_TABLE };
