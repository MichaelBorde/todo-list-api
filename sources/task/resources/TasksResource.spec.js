'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var _ = require('lodash');
var Bluebird = require('bluebird');
var CommandBus = require('@arpinum/backend').CommandBus;
var FakeResponse = require('@arpinum/backend').FakeResponse;
var TasksResource = require('./TasksResource');

describe('The tasks resource', function () {
  var resource;
  var commandBus;

  beforeEach(function () {
    commandBus = new CommandBus();
    resource = new TasksResource(commandBus);
  });

  context('during GET', function () {
    it('should broadcast on the command bus and respond with all tasks', function () {
      var tasks = [{id: '1', text: 'a task'}, {id: '2', text: 'an another task'}];
      commandBus.register('findTasksCommand', function () {
        return Bluebird.resolve(tasks);
      });
      var response = new FakeResponse();

      return resource.get({}, response).then(function () {
        response.send.should.have.been.calledWith(tasks);
      });
    });
  });

  context('during POST', function () {
    it('should broadcast on the command bus and resolve created data', function () {
      var task = {text: 'the text'};
      commandBus.register('addTaskCommand', function (givenTask) {
        if (_.isEqual(task, givenTask)) {
          return Bluebird.resolve({id: '1337'});
        }
        return Bluebird.resolve();
      });
      var request = {
        body: task
      };
      var response = new FakeResponse();

      return resource.post(request, response).then(function () {
        response.send.should.have.been.calledWith({id: '1337'});
      });
    });

    it('should respond with errors if task is invalid', function () {
      commandBus.register('addTaskCommand', function () {
        return Bluebird.resolve('should not be called');
      });
      var response = new FakeResponse();
      var request = {body: {}, context: {user: {}}};

      var promise = resource.post(request, response);

      return promise.should.be.rejected.then(function (error) {
        error.should.be.defined;
        error.code.should.equal(400);
        error.message.should.equal(
          'Invalid task: ' +
          'the text is mandatory');
      });
    });
  });
});
