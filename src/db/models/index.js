const { Credits, CreditsSchema } = require('./credits.model');
const { Email, EmailSchema } = require('./email.model');
const { User, UserSchema } = require('./user.model');

function setupModels(sequelize) {
  Email.init(EmailSchema, Email.config(sequelize));
  User.init(UserSchema, User.config(sequelize));
  Credits.init(CreditsSchema, Credits.config(sequelize));

  User.associate(sequelize.models);
  Email.associate(sequelize.models);
  Credits.associate(sequelize.models);
  console.log('Models setup successfully');
}

module.exports = setupModels;
