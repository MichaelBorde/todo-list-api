'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var AddTaskCommand = require('./AddTaskCommand');

describe('The add task command', function () {
  var command;
  var taskRepository;

  beforeEach(function () {
    taskRepository = new MemoryRepository();
    command = new AddTaskCommand(
      {task: taskRepository},
      new CommandBus()
    );
  });

  it('should add a new task then return the id', function () {
    var task = {title: 'the title'};

    return command.run(task).then(function (added) {
      added.should.deep.equal({id: task.id});
      taskRepository.tous().should.deep.equal([task]);
    });
  });
});
