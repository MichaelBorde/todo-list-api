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

  it('should add a new task then return the id', function () {
    var newTask = {title: 'the title'};

    return handler(newTask).then(function (withId) {
      taskRepository.all().should.have.lengthOf(1);
      var addedTask = taskRepository.all()[0];
      addedTask.title.should.equal('the title');
      withId.should.deep.equal({id: addedTask.id});
    });
  });

  it('should broadcast an event after the task creation', function () {
    var newTask = {title: 'the title'};

    return handler(newTask).then(function () {
      var addedTask = taskRepository.all()[0];
      eventBus.broadcast.should.have.been.calledWith('taskAddedEvent', addedTask);
    });
  });
});
