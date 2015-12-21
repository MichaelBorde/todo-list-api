'use strict';

require('chai').should();
var FindTaskCommand = require('./FindTaskCommand');
var MemoryRepository = require('../../test/MemoryRepository');
var CommandBus = require('../../tools/CommandBus');

describe('The find task command', function () {
  var command;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    command = new FindTaskCommand(
      {task: taskRespository},
      new CommandBus()
    );
  });

  it('should find a task', function () {
    var tasks = [{id: '1', title: 'a title'}, {id: '2', title: 'another title'}];
    taskRespository.withAll(tasks);

    return command.run({id: '2'}).then(function (foundTask) {
      foundTask.should.deep.equal({id: '2', title: 'another title'});
    });
  });
});
