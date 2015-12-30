'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var CommandBus = require('@arpinum/backend').CommandBus;
var FindTaskCommandHandler = require('./FindTaskCommandHandler');

describe('The find task command handler', function () {
  var handler;
  var taskRespository;

  beforeEach(function () {
    taskRespository = new MemoryRepository();
    handler = new FindTaskCommandHandler(
      {task: taskRespository},
      new CommandBus()
    );
  });

  it('should find a task', function () {
    var tasks = [{id: '1', title: 'a title'}, {id: '2', title: 'another title'}];
    taskRespository.withAll(tasks);

    return handler.run({id: '2'}).then(function (foundTask) {
      foundTask.should.deep.equal({id: '2', title: 'another title'});
    });
  });
});
