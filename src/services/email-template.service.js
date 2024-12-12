
const boom = require('@hapi/boom');
const EmailTemplate = require('../db/models/email-template.model');
// const { openai } = require('../utils/open-ai');

class EmailTemplateService {

  async create(data) {
    const newTemplate = new EmailTemplate(data);
    await newTemplate.save();
    return newTemplate;
  }

  async find(query) {
    const { limit, offset } = query;
    const options = {};
    if (limit) options.limit = limit;
    if (offset) options.skip = offset;

    const templates = await EmailTemplate.find({}, null, options);
    return templates;
  }

  async findOne(id) {
    const template = await EmailTemplate.findById(id);
    if (!template) {
      throw boom.notFound('Email template not found');
    }
    return template;
  }

  async update(id, changes) {
    const template = await this.findOne(id);
    Object.assign(template, changes);
    await template.save();
    return template;
  }

  async delete(id) {
    const template = await this.findOne(id);
    await template.remove();
    return { id };
  }

   // New: Generate content using OpenAI
  //  async generateContent({ prompt, templateType }) {
  //   if (!prompt) {
  //     throw boom.badRequest('Prompt is required');
  //   }

  //   try {
  //     const response = await openai.createCompletion({
  //       model: 'text-davinci-003', // Use GPT-4 or GPT-3.5
  //       prompt: `Create a ${templateType} email based on the following description: ${prompt}`,
  //       max_tokens: 500,
  //     });

  //     return {
  //       content: response.data.choices[0].text.trim(),
  //     };
  //   } catch (error) {
  //     console.error('Error generating content:', error);
  //     throw boom.internal('Failed to generate content');
  //   }
  // }

}

module.exports = EmailTemplateService;