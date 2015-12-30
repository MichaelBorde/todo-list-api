'use strict';

require('chai').should();
var MemoryRepository = require('@arpinum/backend').MemoryRepository;
var addTaskCommandHandler = require('./addTaskCommandHandler');

describe('The add task command handler', function () {
  var handler;
  var taskRepository;

  beforeEach(function () {
    taskRepository = new MemoryRepository();
    handler = addTaskCommandHandler({task: taskRepository});
  });

  it('should add a new task then return the id', function () {
    var newTask = {title: 'the title'};

    return handler(newTask).then(function (withId) {
      taskRepository.all().should.have.lengthOf(1);
      var addedTask = taskRepository.all()[0];
      addedTask.title.should.equal('the title');
      withId.should.deep.equal({id: addedTask.id});
    });
  });
});
