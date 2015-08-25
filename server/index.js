"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.info('Server is up and running');
});
