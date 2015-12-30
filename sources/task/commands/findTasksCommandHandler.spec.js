'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var findTasksCommandHandler = require('./findTasksCommandHandler');

describe('The find tasks command handler', function () {
  var handler;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    handler = findTasksCommandHandler({task: taskRespository});
  });

  it('should find all commands', function () {
    var postes = [
      {id: 1, title: 'a title'},
      {id: 2, title: 'another title'}];
    taskRespository.withAll(postes);

    var promise = handler();

    return promise.then(function (tasksFound) {
      var tasksExpected = [
        {id: 1, title: 'a title'},
        {id: 2, title: 'another title'}
      ];
      tasksFound.should.deep.equal(tasksExpected);
    });
  });
});
