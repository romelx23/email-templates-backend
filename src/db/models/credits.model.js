const { DataTypes, Sequelize, Model } = require('sequelize');

const CreditsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
    amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users', // Nombre de la tabla de usuarios
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
}

const CREDITS_TABLE = 'credits';

class Credits extends Model {
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
          tableName: CREDITS_TABLE,
          modelName: 'Credits',
          timestamps: true
        }
      }
}

module.exports = { Credits, CreditsSchema, CREDITS_TABLE };