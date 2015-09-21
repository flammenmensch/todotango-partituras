"use strict";

const gm = require('gm').subClass({ imageMagick: true });
const request = require('request');

function loadRemoteImage(url) {
  return new Promise((resolve, reject) => {
    request({ url: url, encoding: null }, (err, response, body) => {
      if (err) {
        return reject(err);
      }

      resolve(body);
    });
  });
}

function convertGifToPng(image) {
  return new Promise((resolve, reject) => {
    gm(image).setFormat('png').toBuffer((err, buffer) => {
      if (err) {
        return reject(err);
      }

      resolve(buffer);
    });
  });
}

function loadAndConvert(url) {
  return loadRemoteImage(url).then(blob => convertGifToPng(blob));
}

module.exports = {
  loadAndConvert: loadAndConvert
};
