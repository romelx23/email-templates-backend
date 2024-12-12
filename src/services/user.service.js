const boom = require('@hapi/boom');
const { models } = require('../db/sequelize');

class UserService {

  constructor() {}

  async findAll() {
    const users = await models.User.findAll();
    return users;
  }

  async findById(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  }

  async findByEmail(email) {
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  }

  async create(data) {
    console.log({data});
    const existingUser = await models.User.findOne({ where: { email: data.email } });

    console.log({ existingUser });

    if (existingUser) {
      throw boom.conflict('Email is already in use');
    }

    // const newUser = await User.create(data);
    // return newUser;
    // Proceed to create the user
    const newUser = await models.User.create({
      email: data.email,
      name: data.name,
      authType: data.authType || 'google', // Default to 'google'
      // googleId: data.googleId || null,
      img: data.img || null,
      status: true, // Set default status to active
    });

    return newUser;
  }

  async update(id, changes) {
    const user = await this.findById(id);
    const updatedUser = await user.update(changes);
    return updatedUser;
  }

  async delete(id) {
    const user = await this.findById(id);
    await user.destroy();
    return { id };
  }

  async registerGoogleUser(googleProfile) {
    const { email, googleId, name } = googleProfile;

    let user = await this.findByEmail(email).catch(() => null);
    if (!user) {
      user = await this.create({
        email,
        googleId,
        name,
        authType: 'google',
      });
    }

    return user;
  }

  async findCreditsByUserId(userId) {
    const credits = await models.Credits.findOne({ where: { userId } });
    return credits;
  }

  async createCredits(userId) {
    const newCredits = await models.Credits.create({ 
      amount: 100, // Default to 100 credits
      userId
     });
    return newCredits;
  }
}

module.exports = UserService;
