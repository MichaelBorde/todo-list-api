'use strict';

require('chai').should();
var MemoryDatabase = require('@arpinum/backend').MemoryDatabase;
var QueriedObjectNotFoundError = require('@arpinum/backend').QueriedObjectNotFoundError;
var UserProjection = require('../projections/UserProjection');
var userQueryHandler = require('./userQueryHandler');

describe('The user query handler', function () {

  var handler;
  var database;

  beforeEach(function () {
    database = new MemoryDatabase();
    handler = userQueryHandler({user: new UserProjection(database)});
  });

  it('should find a user', function () {
    database.collections['users.projection'] = [
      {id: '1', name: 'a user'},
      {id: '2', name: 'another user'}
    ];

    var promise = handler({id: '2'});

    return promise.should.eventually.deep.equal({id: '2', name: 'another user'});
  });

  it('should reject if cannot find any user', function () {
    database.collections['users.projection'] = [];

    var promise = handler({name: 'a user'});

    return promise.should.be.rejectedWith(QueriedObjectNotFoundError);
  });
});
