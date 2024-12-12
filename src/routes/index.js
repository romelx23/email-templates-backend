const express = require('express');

const authRouter = require('./auth.router');
const emailsRouter = require('./emails.router');
const emailTemplateRouter = require('./email-templates.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/email', emailsRouter);
  router.use('/email-template', emailTemplateRouter);
  router.use('/auth', authRouter);
}

module.exports = routerApi;
