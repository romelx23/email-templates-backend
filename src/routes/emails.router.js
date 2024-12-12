const express = require('express');

const EmailService = require('../services/email.service.js');
const validatorHandler = require('../middlewares/validator.handler');
const { createEmailDto, updateEmailDto, getEmailDto, queryEmailDto, generateEmailDto, generateImageDto } = require('../dtos/email.dto');
const { validateJWT } = require('../middlewares/jwt.handler.js');
const UserService = require('../services/user.service.js');

const router = express.Router();
const service = new EmailService();
const userService = new UserService();

router.get('/',
  validateJWT, // Protect this route
  validatorHandler(queryEmailDto, 'query'),
  async (req, res, next) => {
    try {
      const tasks = await service.find(req.user,req.query);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validateJWT, // Protect this route
  validatorHandler(getEmailDto, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const task = await service.findOne(id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

// router.post('/generate-email',
//   validateJWT, // Protect this route
//   validatorHandler(createEmailDto, 'body'),
//   async (req, res, next) => {
//     try {
//       const body = req.body;
//       const newTask = await service.create(req.user,body);
//       res.status(201).json(newTask);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// routes for generating emails

router.post('/generate-email',
  validateJWT,
  validatorHandler(generateEmailDto, 'body'),
  async (req, res, next) => {
    try {
      const result = await service.generateEmail(req.user, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/generate-image',
  validateJWT,
  validatorHandler(generateImageDto, 'body'),
  async (req, res, next) => {
    try {
      const result = await service.generateImage(req.user, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);


router.post('/credits', 
  validateJWT,
  async (req, res, next) => {
  try {
    const userId = req.user.sub;
    console.log({ userId });
    const result = await userService.findCreditsByUserId(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/',
  validateJWT, // Protect this route
  validatorHandler(createEmailDto, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newTask = await service.create(req.user,body);
      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validateJWT, // Protect this route
  validatorHandler(getEmailDto, 'params'),
  validatorHandler(updateEmailDto, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const task = await service.update(id, body);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validateJWT, // Protect this route
  validatorHandler(getEmailDto, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
