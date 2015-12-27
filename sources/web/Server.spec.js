'use strict';

require('chai').should();
var rewire = require('rewire');
var _ = require('lodash');
var rp = require('request-promise');
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var configuration = require('../configuration');
var constants = require('../test/constants');
var Server = rewire('./Server');

describe('The server', function () {
  var server;
  var repositories;

  beforeEach(function () {
    configuration.serverPort = 9090;

    repositories = {
      task: new MemoryRepository(),
      account: new MemoryRepository(),
      user: new MemoryRepository()
    };
    repositories.account.with({email: constants.EMAIL, password: constants.PASSWORD_IN_BCRYPT});
    repositories.user.with({email: constants.EMAIL});

    Server.__set__({
      Database: function Database() {
        this.initialize = _.noop;
      },
      Repositories: function Repositories() {
        _.merge(this, repositories);
      }
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

      return promise.should.be.rejected.then(function (raison) {
        raison.response.statusCode.should.equal(404);
        var message = 'No entity for ' + JSON.stringify({id: '42'});
        raison.response.body.should.deep.equal(JSON.stringify({'error': message}));
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
