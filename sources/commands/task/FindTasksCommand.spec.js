'use strict';

require('chai').should();
var FindTasksCommand = require('./FindTasksCommand');
var MemoryRepository = require('../../test/MemoryRepository');
var CommandBus = require('../../tools/CommandBus');

describe('The find tasks command', function () {
  var command;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    command = new FindTasksCommand(
      {task: taskRespository},
      new CommandBus()
    );
  });

  it('should find all commands', function () {
    var postes = [
      {id: 1, title: 'a title'},
      {id: 2, title: 'another title'}];
    taskRespository.withAll(postes);

    var promise = command.run();

    return promise.then(function (tasksFound) {
      var tasksExpected = [
        {id: 1, title: 'a title'},
        {id: 2, title: 'another title'}
      ];
      tasksFound.should.deep.equal(tasksExpected);
    });
  });
});
