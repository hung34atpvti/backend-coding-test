const express = require('express');
const ridesRouter = require('./routes/rides-route');

const app = express();
const appConfig = db => {
  app.get('/health', (req, res) => res.send('Healthy'));
  app.use((req, res, next) => {
    req.db = db;
    next();
  });
  app.use('/rides', ridesRouter);
  return app;
};

module.exports = appConfig;
