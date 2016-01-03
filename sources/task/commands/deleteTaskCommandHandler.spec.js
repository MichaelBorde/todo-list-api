'use strict';

require('chai').should();
var sinon = require('sinon');
var repositoryInMemory = require('@arpinum/backend').repositoryInMemory;
var TaskRepository = require('../TaskRepository');
var deleteTaskCommandHandler = require('./deleteTaskCommandHandler');

describe('The delete task command handler', function () {
  var handler;
  var taskRepository;
  var eventBus;

  beforeEach(function () {
    taskRepository = repositoryInMemory(TaskRepository);
    eventBus = {broadcast: sinon.stub()};
    handler = deleteTaskCommandHandler({task: taskRepository}, {event: eventBus});
  });

  it('should delete a task via the repository', function () {
    taskRepository.with({id: '1', title: 'title'});

    return handler({id: '1'}).then(function () {
      taskRepository.all().should.be.empty;
    });
  });

  it('should broadcast an event after the deletion', function () {
    taskRepository.with({id: '1', title: 'title'});

    return handler({id: '1'}).then(function () {
      eventBus.broadcast.should.have.been.calledWith('taskDeletedEvent', {id: '1'});
    });
  });
});
