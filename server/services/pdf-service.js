"use strict";

const async = require('async');
const PDFDocument = require('pdfkit');
const imageService = require('./image-service');

function generateDocumentFromImages(title, subject, images) {
  return new Promise((resolve, reject) => {
    let doc = new PDFDocument({
      size: 'A4',
      layout: 'portrait',
      Title: title,
      Subject: subject
    });

    let counter = 0;
    const total = images.length;

    async.eachSeries(images, (url, callback) => {
      imageService.loadAndConvert(url)
        .then(buffer => {
          doc.image(buffer, { x: 10, y: 10, fit: [ 575, 822 ] });

          if (counter < total - 1) {
            doc.addPage();
          }

          counter++;

          callback();
        })
        .catch(callback);
      }, (err) => {
        if (err) {
          return reject(err);
        }

        doc.end();

        resolve(doc);
      });
  });
}

module.exports = {
  generate: generateDocumentFromImages
};
