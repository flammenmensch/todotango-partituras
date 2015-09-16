"use strict";

const elasticsearch = require('elasticsearch')
const parseApi = require('node-parse-api');
const CLASS_NAME = 'Cancion';
const INDEX_NAME = 'todotango';
const INDEX_TYPE = 'cancion';

const searchClient = new elasticsearch.Client({
  host: process.env.SEARCHBOX_URL
});

const parseClient = new parseApi.Parse({
  app_id: process.env.PARSE_APPLICATION_ID,
  api_key: process.env.PARSE_API_KEY
});

module.exports = {
  search: function(term) {
    return searchClient.search({
      index: INDEX_NAME,
      type: INDEX_TYPE,
      body: {
        query: {
          match: { title: term }
        }
      }
    }).then(results => {
      return results;
    }).catch(err => {
      console.error(err);
      return [];
    });


    /*parseInstance.find(CLASS_NAME, {
      where: {
        title: { $regex: term }
      }
    }, function(err, response) {
      if (err) {
        return reject(err);
      }

      resolve(response);
    });*/
  },

  getPartituraById: function(id) {
    return new Promise((resolve, reject) => {
      parseClient.find(CLASS_NAME, { objectId: id }, function(err, response) {
        if (err) {
          return reject(err);
        }

        resolve(response);
      });
    });
  }
};

