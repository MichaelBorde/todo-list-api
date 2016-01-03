'use strict';

require('chai').should();
var sinon = require('sinon');
var repositoryInMemory = require('@arpinum/backend').repositoryInMemory;
var TaskRepository = require('../TaskRepository');
var updateTaskPartiallyCommandHandler = require('./updateTaskPartiallyCommandHandler');

describe('The update task partially command handler', function () {
  var handler;
  var taskRepository;
  var eventBus;

  beforeEach(function () {
    taskRepository = repositoryInMemory(TaskRepository);
    eventBus = {broadcast: sinon.stub()};
    handler = updateTaskPartiallyCommandHandler({task: taskRepository}, {event: eventBus});
  });

  it('should update the task via the repository', function () {
    taskRepository.with({id: '1', title: 'the title', otherField: 'other value'});
    var command = {criteria: {id: '1'}, update: {title: 'the new title'}};

    return handler(command).then(function () {
      taskRepository.all().should.deep.equal([{
        id: '1',
        title: 'the new title',
        otherField: 'other value'
      }]);
    });
  });

  it('should broadcast an event after the update', function () {
    var command = {criteria: {id: '1'}, update: {title: 'the new title'}};

    return handler(command).then(function () {
      eventBus.broadcast.should.have.been.calledWith('taskPartiallyUpdatedEvent', command);
    });
  });
});
