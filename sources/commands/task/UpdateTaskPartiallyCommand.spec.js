'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var UpdateTaskPartiallyCommand = require('./UpdateTaskPartiallyCommand');

describe('The update task partially command', function () {
  var command;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    command = new UpdateTaskPartiallyCommand(
      {task: taskRespository},
      new CommandBus()
    );
  });

  it('should update the task via the repository', function () {
    taskRespository.with({id: '1', title: 'the title', otherField: 'other value'});
    var updatedTask = {id: '1', title: 'the new title'};

    return command.run(updatedTask).then(function () {
      taskRespository.all().should.deep.equal([{
        id: '1',
        title: 'the new title',
        otherField: 'other value'
      }]);
    });
  });
});
