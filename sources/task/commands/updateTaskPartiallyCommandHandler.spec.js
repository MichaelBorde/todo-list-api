'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var updateTaskPartiallyCommandHandler = require('./updateTaskPartiallyCommandHandler');

describe('The update task partially command handler', function () {
  var handler;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    handler = updateTaskPartiallyCommandHandler({task: taskRespository});
  });

  it('should update the task via the repository', function () {
    taskRespository.with({id: '1', title: 'the title', otherField: 'other value'});
    var updatedTask = {id: '1', title: 'the new title'};

    return handler(updatedTask).then(function () {
      taskRespository.all().should.deep.equal([{
        id: '1',
        title: 'the new title',
        otherField: 'other value'
      }]);
    });
  });
});