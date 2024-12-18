const { Model, DataTypes, Sequelize } = require('sequelize');

const AUTOMATION_TABLE = 'automations';

const AutomationSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  templateId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  recipients: {
    allowNull: false,
    type: DataTypes.JSON, // Store email list as JSON
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // Nombre de la tabla de usuarios
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  scheduleDate: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  scheduleTime: {
    allowNull: false,
    type: DataTypes.TIME
  },  
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'pending',
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
  }
};

class Automation extends Model {

  static associate(models) { // eslint-disable-line
    // Relación con el modelo User
    this.belongsTo(models.User, {
     as: 'user',
     foreignKey: 'userId',
   });
 }

  static config(sequelize) {
    return {
      sequelize,
      tableName: AUTOMATION_TABLE,
      modelName: 'Automation',
      timestamps: false,
    };
  }
}

module.exports = { AUTOMATION_TABLE, AutomationSchema, Automation };