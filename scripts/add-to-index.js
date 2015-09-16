"use strict";

const elasticsearch = require('elasticsearch');
const parse = require('node-parse-api');
const async = require('async');

const INDEX_NAME = 'todotango';
const INDEX_TYPE = 'cancion';

const PARSE_TYPE = 'Cancion';

const searchClient = new elasticsearch.Client({
  host: process.env.SEARCHBOX_URL
});

const parseClient = new parse.Parse({
  app_id: process.env.PARSE_APPLICATION_ID,
  api_key: process.env.PARSE_API_KEY
});

function createIndex(index) {
  return searchClient.indices.create({ index: index });
}

function checkIndex(index) {
  return searchClient.indices.exists({ index: index });
}

function checkAndCreate(index) {
  return checkIndex(index).then(exists => {
    if (exists) {
      return;
    }

    return createIndex(index);
  });
}

function addToIndex(index, type, doc) {
  console.log('processing item [%s] - %s', doc.objectId, doc.title);

  return searchClient.index({
    index: index,
    type: type,
    body: {
      objectId: doc.objectId,
      cover: doc.cover,
      title: doc.title
    }
  });
}

function addMultipleItemsToIndex(index, type, items) {
  console.log('adding %s items to index', items.length);

  return new Promise(resolve => {
    async.eachSeries(items, (item, cb) => {
      addToIndex(index, type, item)
        .then(() => cb())
        .catch(err => cb(err));
    }, () => resolve(items));
  })
}

function queryItems(parseType, index, indexType) {
  return new Promise((resolve, reject) => {
    const limit = 10;

    let lastCount = 0;
    let offset = 1520;

    async.doWhilst(
      callback => {
        console.log('querying and adding to index', limit, offset);
        querySetAndAddToIndex(parseType, limit, offset, index, indexType)
          .then(results => {
            lastCount = results.length;
            offset += limit;
          })
          .then(callback)
          .catch(err => callback(err));
      },
      () => lastCount === limit,
      err => {
        if (err) {
          return reject(err)
        }

        resolve();
      }
    )
  });
}

function querySetOfItems(type, limit, offset) {
  console.log('querying items %s %s', limit, offset);

  return new Promise((resolve, reject) => {
    parseClient.find(type, { limit: limit, skip: offset }, (err, res) => {
      if (err) {
        return reject(err);
      }

      console.log('found', res.results);
      resolve(res.results || []);
    });
  });
}

function querySetAndAddToIndex(parseType, limit, offset, index, indexType) {
  return querySetOfItems(parseType, limit, offset)
    .then(items => addMultipleItemsToIndex(index, indexType, items));
}

checkAndCreate(INDEX_NAME)
  .then(() => queryItems(PARSE_TYPE, INDEX_NAME, INDEX_TYPE))
  .catch(err => console.error(err));

