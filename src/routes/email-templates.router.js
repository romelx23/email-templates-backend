
const express = require('express');
const EmailTemplateService = require('../services/email-template.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createEmailTemplateDto, updateEmailTemplateDto, getEmailTemplateDto } = require('../dtos/email-template.dto');

const router = express.Router();
const service = new EmailTemplateService();

router.get('/',
  async (req, res, next) => {
    try {
      const templates = await service.find(req.query);
      res.json(templates);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validatorHandler(getEmailTemplateDto, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const template = await service.findOne(id);
      res.json(template);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createEmailTemplateDto, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newTemplate = await service.create(body);
      res.status(201).json(newTemplate);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getEmailTemplateDto, 'params'),
  validatorHandler(updateEmailTemplateDto, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const template = await service.update(id, body);
      res.json(template);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getEmailTemplateDto, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({ id });
    } catch (error) {
      next(error);
    }
  }
);

// Generate email content
router.post('/generate', async (req, res, next) => {
    try {
      const { prompt, templateType } = req.body;
      const content = await service.generateContent({ prompt, templateType });
      res.status(200).json(content);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;