'use strict';

require('chai').should();
var UpdateTaskPartiallyCommand = require('./UpdateTaskPartiallyCommand');
var MemoryRepository = require('../../test/MemoryRepository');
var CommandBus = require('../../tools/CommandBus');

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
      taskRespository.tous().should.deep.equal([{
        id: '1',
        title: 'the new title',
        otherField: 'other value'
      }]);
    });
  });
});
