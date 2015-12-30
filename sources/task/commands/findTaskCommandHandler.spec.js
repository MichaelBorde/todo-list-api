'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var findTaskCommandHandler = require('./findTaskCommandHandler');

describe('The find task command handler', function () {
  var handler;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    handler = findTaskCommandHandler({task: taskRespository});
  });

  it('should find a task', function () {
    var tasks = [{id: '1', title: 'a title'}, {id: '2', title: 'another title'}];
    taskRespository.withAll(tasks);

    return handler({id: '2'}).then(function (foundTask) {
      foundTask.should.deep.equal({id: '2', title: 'another title'});
    });
  });
});
