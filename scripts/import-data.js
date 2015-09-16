"use strict";

const parse = require('node-parse-api');
const request = require('request');
const cheerio = require('cheerio');
const async = require('async');

const INDEX_URL = 'http://www.todotango.com/english/music/songs/scores/-/0/0/';

const parseClient = new parse.Parse({
  app_id: process.env.PARSE_APPLICATION_ID,
  api_key: process.env.PARSE_API_KEY
});

function loadPage(url) {
  console.log('Loading page `%s`', url);
  return new Promise(function(resolve, reject) {
    request(url, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        console.log('Loaded');
        return resolve(body);
      }

      reject(err);
    });
  });
}

function parseHtml(html) {
  console.log('Parsing html');
  return cheerio.load(html, { normalizeWhiteSpace: true });
}

function extractTitles($) {
  console.log('Extracting titles');
  var tags = $('div.col-sm-4 div.itemlista a');

  var links = [ ];
  var tag;

  for (var id in tags) {
    tag = tags[id];

    if (tag.name !== 'a') {
      continue;
    }

    links.push({
      id: id,
      title: tag.children[0].data,
      href: tag.attribs.href,
      localId: tag.attribs.id
    });
  }

  return links;
}

function extractPageData($) {
  console.log('Extracting data from page...');
  var lyrics = $('div#letra span#main_Tema1_lbl_Letra').text();
  var scores = $('div#partitura div.cajita_gris2 div').children();
  var cover = $('img#main_Tema1_img_part');
  var genre = $('span#main_Tema1_lbl_Ritmo').text();
  var title = $('span#main_Tema1_lbl_Titulo').text();
  var musicAuthors = $('span#main_Tema1_lbl_TituloAutoresMusica ~ span a');
  var lyricAuthors = $('span#main_Tema1_lbl_TituloAutoresLetra ~ span a');

  var pages = [], composers = [], poets = [];
  var src, i;

  for (i = 0; i < scores.length; i++) {
    src = scores[i].attribs.src;

    if (src.match('pixel.gif') === null) {
      pages.push(src);
    }
  }

  for (i = 0; i < musicAuthors.length; i++) {
    composers.push(musicAuthors[i].children[0].data);
  }

  for (i = 0; i < lyricAuthors.length; i++) {
    poets.push(lyricAuthors[i].children[0].data);
  }

  return {
    title: title,
    genre: genre.length > 0 ? genre : null,
    cover: cover ? cover[0].attribs.src : null,
    music: composers,
    poetry: poets,
    lyrics: lyrics ? lyrics.replace('<br>', '\r\n') : null,
    scores: {
      pageCount: pages.length,
      pages: pages
    }
  };
}

function parsePages(links) {
  console.log('Parsing pages');

  var result = [ ];

  return new Promise(function(resolve, reject) {
    async.eachLimit(links, 3, function(item, callback) {
      loadPage(item.href)
        .then(parseHtml)
        .then(extractPageData)
        .then(saveToCloud)
        .then(function() {
          callback(null);
        })
        .catch(callback);

    }, function(err) {
      if (err) {
        return reject(err);
      }

      console.log('Parsing completed');
      resolve(result);
    })
  });
}

function wait(callback) {
  setTimeout(callback, Math.round(Math.random() * 5000));
}

function saveToCloud(data) {
  console.log('Save to cloud');

  return new Promise(function(resolve, reject) {
    parseClient.insert('Cancion', data, function(err) {
      if (err) {
        return reject(err);
      }

      resolve(true);
    });
  });
}

function start() {
  loadPage(INDEX_URL)
    .then(parseHtml)
    .then(extractTitles)
    .then(parsePages)
    .catch(function(err) {
      console.error(err);
    });
}

start();
