
const Joi = require('joi');

const id = Joi.string().hex().length(24);
const name = Joi.string().min(3).max(50).required();
const subject = Joi.string().min(3).max(100).required();
const body = Joi.string().required();

const createEmailTemplateDto = Joi.object({
  name: name,
  subject: subject,
  body: body,
});

const updateEmailTemplateDto = Joi.object({
  name: Joi.string().min(3).max(50),
  subject: Joi.string().min(3).max(100),
  body: Joi.string(),
});

const getEmailTemplateDto = Joi.object({
  id: id.required(),
});

module.exports = { createEmailTemplateDto, updateEmailTemplateDto, getEmailTemplateDto };