'use strict';

var configuration = require('../configuration');
var Bluebird = require('bluebird');
var MongoClient = require('mongodb').MongoClient;
var Logger = require('mongodb').Logger;
var log = require('../tools/log')(__filename);

function Database() {
  var bddMongo;

  var self = this;
  self.initialize = initialize;
  self.close = close;
  self.findAll = findAll;
  self.findFirst = findFirst;
  self.count = count;
  self.add = add;
  self.update = update;

  function initialize() {
    return new Bluebird(function (resolve, reject) {
      Logger.setLevel(configuration.databaseLogLevel);
      MongoClient.connect(configuration.databaseUrl, function (error, db) {
        if (error) {
          reject('Impossible to connect to database: ' + error.message);
        } else {
          bddMongo = db;
          log.info('Connection to database successful');
          resolve(self);
        }
      });
    });
  }

  function close() {
    bddMongo.close();
  }

  function findAll(collectionName, criteria) {
    return new Bluebird(function (resolve, reject) {
      var collection = bddMongo.collection(collectionName);
      collection.find(criteria).toArray(function (error, docs) {
        if (error) {
          reject(error);
        } else {
          resolve(docs);
        }
      });
    });
  }

  function findFirst(collectionName, criteria) {
    return new Bluebird(function (resolve, reject) {
      var collection = bddMongo.collection(collectionName);
      collection.findOne(criteria, function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    });
  }

  function count(collectionName, criteria) {
    return Bluebird.try(function () {
      var collection = bddMongo.collection(collectionName);
      return collection.count(criteria);
    });
  }

  function add(collectionName, document) {
    return new Bluebird(function (resolve, reject) {
      var collection = bddMongo.collection(collectionName);
      collection.insertOne(document, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  function update(collectionName, criteria, modification) {
    return new Bluebird(function (resolve, reject) {
      var collection = bddMongo.collection(collectionName);
      collection.updateOne(criteria, modification, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Database;
