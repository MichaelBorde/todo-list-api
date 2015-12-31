'use strict';

require('chai').should();
var sinon = require('sinon');
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var updateTaskPartiallyCommandHandler = require('./updateTaskPartiallyCommandHandler');

describe('The update task partially command handler', function () {
  var handler;
  var taskRespository;
  var eventBus;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    eventBus = {broadcast: sinon.stub()};
    handler = updateTaskPartiallyCommandHandler({task: taskRespository}, {event: eventBus});
  });

  it('should update the task via the repository', function () {
    taskRespository.with({id: '1', title: 'the title', otherField: 'other value'});
    var command = {id: '1', title: 'the new title'};

    return handler(command).then(function () {
      taskRespository.all().should.deep.equal([{
        id: '1',
        title: 'the new title',
        otherField: 'other value'
      }]);
    });
  });

  it('should broadcast an event after the update', function () {
    var command = {id: '1', title: 'the new title'};

    return handler(command).then(function () {
      eventBus.broadcast.should.have.been.calledWith('taskPartiallyUpdatedEvent', command);
    });
  });
});
