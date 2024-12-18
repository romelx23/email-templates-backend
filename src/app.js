const express = require('express');
const cors = require('cors');
const path = require('path');
require('./jobs/automation.job'); // Aquí importa las tareas cron
const routerApi = require('./routes');
const { checkApiKey } = require('./middlewares/auth.handler');
const morgan = require("morgan");

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/error.handler');

const createApp = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  //Morgan
  app.use(morgan("dev"));

  // Serve static files from the "public" directory
  app.use(express.static(path.join(__dirname, 'public')));

  // Default route to serve index.html
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // require('./utils/auth');

  app.get('/', (req, res) => {
    res.send('Hola mi server en express');
  });

  app.get('/nueva-ruta', checkApiKey, (req, res) => {
    res.send('Hola, soy una nueva ruta');
  });

  routerApi(app);

  app.use(logErrors);
  app.use(ormErrorHandler);
  app.use(boomErrorHandler);
  app.use(errorHandler);
  return app;
};

module.exports = createApp;
