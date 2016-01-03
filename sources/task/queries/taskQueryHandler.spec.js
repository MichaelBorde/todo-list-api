'use strict';

require('chai').should();
var MemoryDatabase = require('@arpinum/backend').MemoryDatabase;
var QueriedObjectNotFoundError = require('@arpinum/backend').QueriedObjectNotFoundError;
var TaskProjection = require('../projections/TaskProjection');
var taskQueryHandler = require('./taskQueryHandler');

describe('The task query handler', function () {

  var handler;
  var database;

  beforeEach(function () {
    database = new MemoryDatabase();
    handler = taskQueryHandler({task: new TaskProjection(database)});
  });

  it('should find a task based on criteria', function () {
    database.collections['tasks.projection'] = [
      {id: 1, text: 'first task'},
      {id: 2, text: 'second task'}
    ];

    var promise = handler({id: 2});

    return promise.should.eventually.deep.equal({id: 2, text: 'second task'});
  });

  it('should reject if cannot find any task', function () {
    database.collections['tasks.projection'] = [];

    var promise = handler({name: 'document'});

    return promise.should.be.rejectedWith(QueriedObjectNotFoundError);
  });
});
