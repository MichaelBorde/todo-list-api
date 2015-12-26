'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var FindTasksCommand = require('./FindTasksCommand');

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
