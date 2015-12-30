'use strict';

require('chai').should();
var MemoryQueryProcessor = require('@arpinum/backend').MemoryQueryProcessor;
var userQueryHandler = require('./userQueryHandler');

describe('The user query handler', function () {
  var handler;
  var queryProcessor;

  beforeEach(function () {
    queryProcessor = new MemoryQueryProcessor();
    handler = userQueryHandler(queryProcessor);
  });

  it('should find a user', function () {
    queryProcessor.collections.users = [
      {id: '1', name: 'a user'},
      {id: '2', name: 'another user'}
    ];

    var promise = handler({id: '2'});

    return promise.should.eventually.deep.equal({id: '2', name: 'another user'});
  });

  it('should never return the password', function () {
    queryProcessor.collections.users = [{
      id: '1',
      name: 'a user',
      password: 'bleh'
    }];

    var promise = handler({id: '1'});

    return promise.should.eventually.deep.equal({id: '1', name: 'a user'});
  });
});
