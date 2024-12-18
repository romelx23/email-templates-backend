const Joi = require('joi');

const id = Joi.number().integer();
const templateId = Joi.number().integer().required();
const userId = Joi.number().integer();
const scheduleDate = Joi.date().required();
const scheduleTime =  Joi.string().pattern(/^(2[0-3]|[01]?[0-9]):([0-5][0-9])$/).required(); // Hora válida en formato HH:mm
// const recipients = Joi.array()
//   .items(
//     Joi.object({
//       name: Joi.string().required(),
//       email: Joi.string().email().required(),
//     })
//   )
//   .required();
const recipients = Joi.string().required();
// const status = Joi.string().valid('pending', 'completed', 'failed');

const createAutomationDto = Joi.object({
  templateId,
  recipients,
  scheduleDate,
  scheduleTime,
  userId,
});

const getAutomationDto = Joi.object({
  id: id.required(),
});

module.exports = { createAutomationDto, getAutomationDto };