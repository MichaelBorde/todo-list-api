'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var deleteTaskCommandHandler = require('./deleteTaskCommandHandler');

describe('The delete task command handler', function () {
  var handler;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    handler = deleteTaskCommandHandler({task: taskRespository});
  });

  it('should delete a task via the repository', function () {
    taskRespository.with({id: '1', title: 'title'});

    return handler('1').then(function () {
      taskRespository.all().should.be.empty;
    });
  });
});
