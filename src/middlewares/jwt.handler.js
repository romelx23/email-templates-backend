const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const { config } = require('../config/config');

function validateJWT(req, res, next) {
  const token = req.header('Authorization').split(' ')[1]; // Extract token from 'Authorization: Bearer <token>'

  if (!token) {
    return next(boom.unauthorized('Token is required'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (err) {
    return next(boom.unauthorized('Invalid token'));
  }
}

module.exports = { validateJWT };