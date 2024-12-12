const Joi = require('joi');

const id = Joi.number().integer();
// const name = Joi.string().min(3).max(15);
// const price = Joi.number().integer().min(10);
const subject = Joi.string();
const content = Joi.string();
const url = Joi.string().uri();
// const categoryId = Joi.number().integer();

// const price_min = Joi.number().integer();
// const price_max = Joi.number().integer();

// const limit = Joi.number().integer();
// const offset = Joi.number().integer();

const title = Joi.string().min(3).max(50);
const status = Joi.string().valid('pending', 'in-progress', 'completed');
// const color = Joi.string().hex().length(6);

const favorite = Joi.boolean();

const queryEmailDto = Joi.object({
  limit: Joi.number().integer(),
  offset: Joi.number().integer(),
  status: status,
  favorite: favorite,
});

const createEmailDto = Joi.object({
  title: title.required(),
  subject: subject.required(),
  content: content.required(),
  status: status.required(),
  url: url,
  favorite: favorite.default(false),
});

const updateEmailDto = Joi.object({
  title: title,
  subject: subject,
  content: content,
  status: status,
  url: url,
  favorite: favorite,
});

const getEmailDto = Joi.object({
  id: id.required(),
});

const generateEmailDto = Joi.object({
  prompt: Joi.string().required(),
  templateType: Joi.string().required(),
});

const generateImageDto = Joi.object({
  prompt: Joi.string().required(),
});

module.exports = { queryEmailDto,createEmailDto, updateEmailDto, getEmailDto, generateEmailDto, generateImageDto };
