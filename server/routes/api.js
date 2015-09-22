"use strict";

const router = require('express').Router();
const pdfService = require('../services/pdf-service');
const todotangoService = require('../services/todotango-service');

router.route('/search')
  .get(function(req, res, next) {
    var term = req.query.q || '';

    todotangoService
      .search(term)
      .then(function(response) {
        const result = response.hits.hits.map(i => i._source);

        res.json(result);
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

router.route('/partitura/:id/export')
  .get(function(req, res, next) {
    var id = req.params.id;

    todotangoService
      .getPartituraById(id)
      .then(response => pdfService.generate(response.title, response.genre, response.scores.pages))
      .then(doc => {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=partitura.pdf'
        });

        doc.pipe(res);
      })
      .catch(function(err) {
        next(new Error('Could not perform export. ' + err.message));
      });
  });

router.use(function(req, res, next) {
  res.status(404).json({ error: true, message: 'API Error: Invalid API endpoint' });
});

module.exports = router;
