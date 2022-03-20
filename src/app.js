const express = require('express');
const bodyParser = require('body-parser');
const ridesController = require('./domain/rides/controller/rides-controller');
const { validateCreateBody } = require('./middleware/validate-body-ride');

const app = express();
const jsonParser = bodyParser.json();

module.exports = db => {
  app.get('/health', (req, res) => res.send('Healthy'));
  app.post(
    '/rides',
    jsonParser,
    validateCreateBody,
    (req, res) => ridesController.createRide
  );

  app.get('/rides', (req, res) => ridesController.getRides(req, res, db));

  app.get('/rides/:id', (req, res) =>
    ridesController.getRideById(req, res, db)
  );

  return app;
};
