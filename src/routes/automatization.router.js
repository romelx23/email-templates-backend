const express = require('express');

const validatorHandler = require('../middlewares/validator.handler');
// const { createAutomationDto, getAutomationDto } = require('../dtos/automation.dto');
const AutomationService = require('../services/automatizatrion.service');
const { createAutomationDto, getAutomationDto } = require('../dtos/automatization.dto');
const { validateJWT } = require('../middlewares/jwt.handler');

const router = express.Router();
const service = new AutomationService();

// Crear nueva automatización
router.post(
  '/',
  validateJWT,
  validatorHandler(createAutomationDto, 'body'),
  async (req, res, next) => {
    try {
        console.log(req.body);
      const automation = await service.create(req.body, req.user);
      res.status(201).json(automation);
    } catch (error) {
      next(error);
    }
  }
);

// Obtener todas las automatizaciones
router.get('/', 
validateJWT,
  async (req, res, next) => {
    console.log({user:req.user});
  try {
    const automations = await service.find(req.user);
    res.json(automations);
  } catch (error) {
    next(error);
  }
});

// Obtener automatización por ID
router.get(
  '/:id',
  validateJWT,
  validatorHandler(getAutomationDto, 'params'),
  async (req, res, next) => {

    console.log({user:req.user});

    try {
      const { id } = req.params;
      const automation = await service.findOne(id,req.user);
      res.json(automation);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;