'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var DeleteTaskCommandHandler = require('./DeleteTaskCommandHandler');

describe('The delete task command handler', function () {
  var handler;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    handler = new DeleteTaskCommandHandler(
      {task: taskRespository},
      new CommandBus()
    );
  });

  it('should delete a task via the repository', function () {
    taskRespository.with({id: '1', title: 'title'});

    return handler.run('1').then(function () {
      taskRespository.all().should.be.empty;
    });
  });
});
