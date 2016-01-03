'use strict';

require('chai').should();
var MemoryDatabase = require('@arpinum/backend').MemoryDatabase;
var TaskProjection = require('../projections/TaskProjection');
var tasksQueryHandler = require('./tasksQueryHandler');

describe('The tasks query handler', function () {

  var handler;
  var database;

  beforeEach(function () {
    database = new MemoryDatabase();
    handler = tasksQueryHandler({task: new TaskProjection(database)});
  });

  it('should find tasks based on criteria', function () {
    var tasks = [
      {id: 1, text: 'text'},
      {id: 2, text: 'another text'},
      {id: 3, text: 'text'}
    ];
    database.collections['tasks.projection'] = tasks;

    var promise = handler({text: 'text'});

    var expectedTasks = [
      {id: 1, text: 'text'},
      {id: 3, text: 'text'}
    ];
    return promise.should.eventually.deep.equal(expectedTasks);
  });
});
