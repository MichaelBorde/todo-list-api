'use strict';

require('chai').should();
var MemoryDatabase = require('@arpinum/backend').MemoryDatabase;
var TaskProjection = require('./TaskProjection');

describe('The task projection', function () {

  var database;
  var projection;

  beforeEach(function () {
    database = new MemoryDatabase();
    projection = new TaskProjection(database);
  });

  it('should add task on task added event', function () {
    var eventData = {id: '1', text: 'the text'};

    var onEvent = projection.onTaskAddedEvent(eventData);

    return onEvent.then(function () {
      database.collections['tasks.projection'].should.deep.equal([{id: '1', text: 'the text'}]);
    });
  });

  it('should delete task on task deleted event', function () {
    database.collections['tasks.projection'] = [{id: '1', text: 'the text'}];
    var eventData = {id: '1'};

    var onEvent = projection.onTaskDeletedEvent(eventData);

    return onEvent.then(function () {
      database.collections['tasks.projection'].should.be.empty;
    });
  });

  it('should update task on task updated event', function () {
    database.collections['tasks.projection'] = [{id: '1', text: 'the text'}];
    var eventData = {id: '1', text: 'the updated text'};

    var onEvent = projection.onTaskPartiallyUpdatedEvent(eventData);

    return onEvent.then(function () {
      database.collections['tasks.projection'].should.deep.equal([{id: '1', text: 'the updated text'}]);
    });
  });

  it('should find first task in database', function () {
    database.collections['tasks.projection'] = [
      {id: '1', text: 'the text'},
      {id: '2', text: 'the other text'}
    ];

    var findFirst = projection.findFirst({id: '1'});

    return findFirst.should.eventually.deep.equal({id: '1', text: 'the text'});
  });

  it('should find all tasks in database', function () {
    database.collections['tasks.projection'] = [
      {id: '1', text: 'the text'},
      {id: '2', text: 'the other text'},
      {id: '3', text: 'the text'}
    ];

    var findAll = projection.findAll({text: 'the text'});

    var expectedTasks = [
      {id: '1', text: 'the text'},
      {id: '3', text: 'the text'}
    ];
    return findAll.should.eventually.deep.equal(expectedTasks);
  });
});
