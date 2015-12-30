'use strict';

require('chai').should();
var MemoryQueryProcessor = require('@arpinum/backend').MemoryQueryProcessor;
var taskQueryHandler = require('./taskQueryHandler');

describe('The task query handler', function () {
  var handler;
  var queryProcessor;

  beforeEach(function () {
    queryProcessor = new MemoryQueryProcessor();
    handler = taskQueryHandler(queryProcessor);
  });

  it('should find a task based on criteria', function () {
    var tasks = [
      {id: 1, text: 'first task'},
      {id: 2, text: 'second task'}
    ];
    queryProcessor.collections.tasks = tasks;

    var promise = handler({id: 2});

    return promise.should.eventually.deep.equal({id: 2, text: 'second task'});
  });
});
