const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('./../config/config');
const UserService = require('./user.service');
const { googleVerify } = require('../utils/google-verify');
const service = new UserService();

class AuthService {

  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();;
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role
    }
    const access_token = jwt.sign(payload, config.jwtSecret);
    console.log({access_token});
    return {
      user,
      access_token
    };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
    const link = `http://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, {recoveryToken: token});
    const mail = {
      from: config.smtpEmail,
      to: `${user.email}`,
      subject: "Email para recuperar contraseña",
      html: `<b>Ingresa a este link => ${link}</b>`,
    }
    const rta = await this.sendMail(mail);
    return rta;
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, {recoveryToken: null, password: hash});
      return { message: 'password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: config.smtpEmail,
        pass: config.smtpPassword
      }
    });
    await transporter.sendMail(infoMail);
    return { message: 'mail sent' };
  }

  async googleSignin(idToken) {
    try {
      const { email, name, picture } = await googleVerify(idToken);

      // console.log({ email, name, picture });

      let user = await service.findByEmail(email)
      .catch((err) => console.log(err));
      console.log("===========user==============",{user});

      if (!user) {
        // Register new user if not found
        const newUser = {
          name,
          email,
          authType: 'google',
          googleId: idToken, // Store Google ID as a reference
          img: picture
        };
        user = await service.create(newUser);
      }

      // Ensure user is active
      if (!user.status) {
        throw boom.unauthorized('User is inactive. Contact administrator.');
      }

      // Obtener los créditos asociados al usuario
      const credits = await service.findCreditsByUserId(user.id);

      console.log({ credits });
      // if credits null, create new credits
      if (!credits) {
        await service.createCredits(user.id);
      }

      // Generate and return token
      return {
        user,
        access_token: this.signToken(user).access_token,
        credits
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw boom.unauthorized('Invalid Google token');
    }
  }

  async renew(token) {
    try {
      console.log({ token });
      const { sub: userId } = jwt.verify(token, config.jwtSecret);
  
      const user = await service.findById(userId);
      if (!user || !user.status) {
        throw boom.unauthorized("Invalid or inactive user");
      }

      // Obtener los créditos asociados al usuario
      const credits = await service.findCreditsByUserId(user.id);
  
      console.log({ credits });
      // if credits null, create new credits
      if (!credits) {
        await service.createCredits(user.id);
      }

      // Return a new token
      return {
        user,
        access_token: this.signToken(user).access_token,
        credits
      }
    } catch (error) {
      console.error("Renew token error:", error);
      throw boom.unauthorized("Invalid token");
    }
  }
}

module.exports = AuthService;
