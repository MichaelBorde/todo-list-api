'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var DeleteTaskCommand = require('./DeleteTaskCommand');

describe('The delete task command', function () {
  var command;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    command = new DeleteTaskCommand(
      {task: taskRespository},
      new CommandBus()
    );
  });

  it('should delete a task via the repository', function () {
    taskRespository.with({id: '1', title: 'title'});

    return command.run('1').then(function () {
      taskRespository.tous().should.be.empty;
    });
  });
});
