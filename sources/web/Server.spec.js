'use strict';

require('chai').should();
var rewire = require('rewire');
var _ = require('lodash');
var rp = require('request-promise');
var MemoryDatabase = require('@arpinum/backend').MemoryDatabase;
var configuration = require('../configuration');
var constants = require('../test/constants');
var Server = rewire('./Server');

describe('The server', function () {
  var server;
  var database;

  beforeEach(function () {
    configuration.serverPort = 9090;

    database = new MemoryDatabase();
    database.collections.users = [{email: constants.EMAIL, password: constants.PASSWORD_IN_BCRYPT}];
    database.collections['users.projection'] = [{email: constants.EMAIL}];

    Server.__set__({
      MongoDatabase: _.constant(database)
    });

    server = new Server();
    return server.start();
  });

  afterEach(function () {
    return server.stop();
  });

  it('should respond with a 401 for protected uri', function () {
    var promise = rp(server.root() + '/tasks');

    return promise.should.be.rejected.then(function (raison) {
      raison.response.statusCode.should.equal(401);
    });
  });

  it('should authenticate successfully', function () {
    var promise = createValidAuthentication();

    return promise.should.eventually.match(constants.JWT_REGEX);
  });

  it('should respond with a 401 if user is unknown', function () {
    var promise = createAuthentication('unknown@mail.com', 'bleh');

    return promise.should.be.rejected.then(function (reason) {
      reason.response.statusCode.should.equal(401);
    });
  });

  it('should respond with a 401 if password is wrong', function () {
    var promise = createAuthentication(constants.EMAIL, 'bleh');

    return promise.should.be.rejected.then(function (reason) {
      reason.response.statusCode.should.equal(401);
    });
  });

  it('should respond with a 404 if resource is cannot be found', function () {
    return createValidAuthentication().then(function (response) {
      var promise = rp(server.root() + '/tasks/42', {headers: {'Cookie': response.headers['set-cookie']}});

      return promise.should.be.rejected.then(function (reason) {
        reason.response.statusCode.should.equal(404);
        var message = 'Queried object not found for ' + JSON.stringify({id: '42'});
        reason.response.body.should.deep.equal(JSON.stringify({'error': message}));
      });
    });
  });

  function createValidAuthentication() {
    return createAuthentication(constants.EMAIL, constants.PASSWORD);
  }

  function createAuthentication(email, password) {
    var options = {
      body: {email: email, password: password},
      json: true,
      resolveWithFullResponse: true
    };
    return rp.post(server.root() + '/authentications', options);
  }
});
