'use strict';

require('chai').should();
var sinon = require('sinon');
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var deleteTaskCommandHandler = require('./deleteTaskCommandHandler');

describe('The delete task command handler', function () {
  var handler;
  var taskRespository;
  var eventBus;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    eventBus = {broadcast: sinon.stub()};
    handler = deleteTaskCommandHandler({task: taskRespository}, {event: eventBus});
  });

  it('should delete a task via the repository', function () {
    taskRespository.with({id: '1', title: 'title'});

    return handler({id: '1'}).then(function () {
      taskRespository.all().should.be.empty;
    });
  });

  it('should broadcast an event after the deletion', function () {
    taskRespository.with({id: '1', title: 'title'});

    return handler({id: '1'}).then(function () {
      eventBus.broadcast.should.have.been.calledWith('taskDeletedEvent', {id: '1'});
    });
  });
});
