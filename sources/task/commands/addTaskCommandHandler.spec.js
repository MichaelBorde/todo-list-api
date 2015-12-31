'use strict';

require('chai').should();
var sinon = require('sinon');
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var addTaskCommandHandler = require('./addTaskCommandHandler');

describe('The add task command handler', function () {
  var handler;
  var taskRepository;
  var eventBus;

  beforeEach(function () {
    taskRepository = new MemoryRepository();
    eventBus = {broadcast: sinon.stub()};
    handler = addTaskCommandHandler({task: taskRepository}, {event: eventBus});
  });

  it('should add a new task', function () {
    var newTask = {id: '1', title: 'the title'};

    return handler(newTask).then(function () {
      taskRepository.all().should.deep.equal([newTask]);
    });
  });

  it('should broadcast an event after the creation', function () {
    var newTask = {id: '1', title: 'the title'};

    return handler(newTask).then(function () {
      eventBus.broadcast.should.have.been.calledWith('taskAddedEvent', newTask);
    });
  });
});
