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
    var newTask = {title: 'the title'};

    return command.run(newTask).then(function (withId) {
      taskRepository.all().should.have.lengthOf(1);
      var addedTask = taskRepository.all()[0];
      addedTask.title.should.equal('the title');
      withId.should.deep.equal({id: addedTask.id});
    });
  });
});
