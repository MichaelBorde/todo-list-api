'use strict';

require('chai').should();
var MemoryQueryProcessor = require('@arpinum/backend').MemoryQueryProcessor;
var tasksQueryHandler = require('./tasksQueryHandler');

describe('The tasks query handler', function () {
  var handler;
  var queryProcessor;

  beforeEach(function () {
    queryProcessor = new MemoryQueryProcessor();
    handler = tasksQueryHandler(queryProcessor);
  });

  it('should find tasks based on criteria', function () {
    var tasks = [
      {id: 1, text: 'text'},
      {id: 2, text: 'another text'},
      {id: 3, text: 'text'}
    ];
    queryProcessor.collections.tasks = tasks;

    var promise = handler({text: 'text'});

    var expectedTasks = [
      {id: 1, text: 'text'},
      {id: 3, text: 'text'}
    ];
    return promise.should.eventually.deep.equal(expectedTasks);
  });
});
