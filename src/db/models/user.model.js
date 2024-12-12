const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_TABLE = 'users';

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name:{
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: true, // Can be null for Google-authenticated users
    type: DataTypes.STRING,
  },
  authType: {
    allowNull: false,
    type: DataTypes.STRING, // e.g., 'google', 'password', 'oauth'
    defaultValue: 'password',
  },
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'customer'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  status:{
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
};

class User extends Model {
  static associate(models) {
  // static associate(models) {
    // this.hasOne(models.Customer, {
    //   as: 'customer',
    //   foreignKey: 'userId'
    // });
    this.hasMany(models.Email, {
      as: 'emails',
      foreignKey: 'userId',
    });
    this.hasMany(models.Credits, {
      as: 'credits',
      foreignKey: 'userId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    };
  }
}

module.exports = { USER_TABLE, UserSchema, User };