'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var _ = require('lodash');
var Bluebird = require('bluebird');
var CommandBus = require('@arpinum/backend').CommandBus;
var QueryBus = require('@arpinum/backend').QueryBus;
var FakeResponse = require('@arpinum/backend').FakeResponse;
var TaskResource = require('./TaskResource');

describe('The task resource', function () {
  var resource;
  var commandBus;
  var queryBus;

  beforeEach(function () {
    commandBus = new CommandBus();
    queryBus = new QueryBus();
    resource = new TaskResource({command: commandBus, query: queryBus});
  });

  context('during GET', function () {
    it('should broadcast on the command bus and send the task', function () {
      var task = {id: '1', text: 'a task'};
      queryBus.register('taskQuery', function (p) {
        return p.id === '1' ? Bluebird.resolve(task) : null;
      });
      var response = new FakeResponse();

      return resource.get({params: {id: '1'}}, response).then(function () {
        response.send.should.have.been.calledWith(task);
      });
    });
  });

  context('during PATCH', function () {
    it('should broadcast on the command bus and end the response', function () {
      commandBus.register('updateTaskPartiallyCommand', function (t) {
        return _.isEqual(t, {id: '1', text: 'a task'}) ? Bluebird.resolve() : null;
      });
      var request = {
        params: {id: '1'},
        body: {text: 'a task'}
      };
      var response = new FakeResponse();

      return resource.patch(request, response).then(function () {
        response.end.should.have.been.called;
      });
    });
  });

  context('during DELETE', function () {
    it('should broadcast on the command bus and end the response', function () {
      commandBus.register('deleteTaskCommand', function (id) {
        return id === '1' ? Bluebird.resolve() : null;
      });
      var request = {params: {id: '1'}};
      var response = new FakeResponse();

      return resource.delete(request, response).then(function () {
        response.end.should.have.been.called;
      });
    });
  });
});
