'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var Bluebird = require('bluebird');
var sinon = require('sinon');
var FakeResponse = require('@arpinum/backend').FakeResponse;
var TaskResource = require('./TaskResource');

describe('The task resource', function () {
  var resource;
  var commandBus;
  var queryBus;

  beforeEach(function () {
    commandBus = {broadcast: sinon.stub().returns(Bluebird.resolve())};
    queryBus = {broadcast: sinon.stub().returns(Bluebird.resolve())};
    resource = new TaskResource({command: commandBus, query: queryBus});
  });

  context('during GET', function () {
    it('should broadcast on the query bus and send the task', function () {
      var task = {id: '1', text: 'a task'};
      queryBus.broadcast.withArgs('taskQuery', {id: '1'}).returns(Promise.resolve(task));
      var response = new FakeResponse();

      var promise = resource.get({params: {id: '1'}}, response);

      return promise.then(function () {
        response.send.should.have.been.calledWith(task);
      });
    });
  });

  context('during PATCH', function () {
    it('should broadcast on the command bus and end the response', function () {
      var request = {
        params: {id: '1'},
        body: {text: 'a task'}
      };
      var response = new FakeResponse();

      return resource.patch(request, response).then(function () {
        var command = {criteria: {id: '1'}, update: {text: 'a task'}};
        commandBus.broadcast.should.have.been.calledWith('updateTaskPartiallyCommand', command);
        response.end.should.have.been.called;
      });
    });
  });

  context('during DELETE', function () {
    it('should broadcast on the command bus and end the response', function () {
      var request = {params: {id: '1'}};
      var response = new FakeResponse();

      var promise = resource.delete(request, response);

      return promise.then(function () {
        commandBus.broadcast.should.have.been.calledWith('deleteTaskCommand', {id: '1'});
        response.end.should.have.been.called;
      });
    });
  });
});
