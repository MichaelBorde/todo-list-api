'use strict';

require('chai').should();
var MemoryDatabase = require('@arpinum/backend').MemoryDatabase;
var UserProjection = require('./UserProjection');

describe('The user projection', function () {

  var database;
  var projection;

  beforeEach(function () {
    database = new MemoryDatabase();
    projection = new UserProjection(database);
  });

  it('should add user on user added event', function () {
    var eventData = {id: '1', email: 'the email'};

    var onEvent = projection.onUserAddedEvent(eventData);

    return onEvent.then(function () {
      database.collections['users.projection'].should.deep.equal([{id: '1', email: 'the email'}]);
    });
  });

  it('should find first user in database', function () {
    database.collections['users.projection'] = [
      {id: '1', email: 'the email'},
      {id: '2', email: 'the other email'}
    ];

    var findFirst = projection.findFirst({id: '1'});

    return findFirst.should.eventually.deep.equal({id: '1', email: 'the email'});
  });
});
