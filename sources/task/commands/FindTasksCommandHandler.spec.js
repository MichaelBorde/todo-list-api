'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var FindTasksCommandHandler = require('./FindTasksCommandHandler');

describe('The find tasks command handler', function () {
  var handler;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    handler = new FindTasksCommandHandler(
      {task: taskRespository},
      new CommandBus()
    );
  });

  it('should find all commands', function () {
    var postes = [
      {id: 1, title: 'a title'},
      {id: 2, title: 'another title'}];
    taskRespository.withAll(postes);

    var promise = handler.run();

    return promise.then(function (tasksFound) {
      var tasksExpected = [
        {id: 1, title: 'a title'},
        {id: 2, title: 'another title'}
      ];
      tasksFound.should.deep.equal(tasksExpected);
    });
  });
});
