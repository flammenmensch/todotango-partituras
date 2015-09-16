"use strict";

var router = require('express').Router();
var todotangoService = require('../services/todotango-service');

router.route('/search')
  .get(function(req, res, next) {
    var term = req.query.q || '';

    todotangoService
      .search(term)
      .then(function(response) {
        res.json(response);
      })
      .catch(function(err) {
        next(new Error('Could not perform search'));
      });
  });

router.route('/partitura/:id')
  .get(function(req, res, next) {
    var id = req.params.id;

    todotangoService
      .getPartituraById(id)
      .then(function(response) {
        res.json(response);
      })
      .catch(function(err) {
        next(new Error('Partitura not found'));
      });
  });

router.use(function(req, res, next) {
  res.status(404).json({ error: true, message: 'API Error: Invalid API endpoint' });
});

module.exports = router;
