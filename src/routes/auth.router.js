const express = require('express');
const passport = require('passport');

const AuthService = require('./../services/auth.service');

const router = express.Router();
const service = new AuthService();

router.post('/login',
  passport.authenticate('local', {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery',
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const rta = await service.sendRecovery(email);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/change-password',
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const rta = await service.changePassword(token, newPassword);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/google', async (req, res, next) => {
  try {
    const { id_token: idToken } = req.body;
    console.log(idToken)
    const result = await service.googleSignin(idToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/renew',async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await service.renew(token);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
);

module.exports = router;
