'use strict';

require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).should();
var _ = require('lodash');
var Bluebird = require('bluebird');
var sinon = require('sinon');
var rewire = require('rewire');
var FakeResponse = require('@arpinum/backend').FakeResponse;
var TasksResource = rewire('./TasksResource');

describe('The tasks resource', function () {
  var resource;
  var commandBus;
  var queryBus;

  beforeEach(function () {
    commandBus = {broadcast: sinon.stub().returns(Bluebird.resolve())};
    queryBus = {broadcast: sinon.stub().returns(Bluebird.resolve())};

    TasksResource.__set__({
      uuid: {create: _.constant('1337')}
    });

    resource = new TasksResource({command: commandBus, query: queryBus});
  });

  context('during GET', function () {
    it('should broadcast on the query bus and respond with all tasks', function () {
      var tasks = [{id: '1', text: 'a task'}, {id: '2', text: 'an another task'}];
      queryBus.broadcast.withArgs('tasksQuery').returns(Bluebird.resolve(tasks));
      var response = new FakeResponse();

      var promise = resource.get({}, response);

      return promise.then(function () {
        response.send.should.have.been.calledWith(tasks);
      });
    });
  });

  context('during POST', function () {
    it('should broadcast on the command bus and resolve created id', function () {
      var task = {text: 'the text'};
      var request = {body: task};
      var response = new FakeResponse();

      var post = resource.post(request, response);

      return post.then(function () {
        commandBus.broadcast.should.have.been.calledWith('addTaskCommand', {id: '1337', text: 'the text'});
        response.send.should.have.been.calledWith({id: '1337'});
      });
    });

    it('should respond with errors if task is invalid', function () {
      var response = new FakeResponse();
      var request = {body: {}};

      var promise = resource.post(request, response);

      return promise.should.be.rejected.then(function (error) {
        commandBus.broadcast.should.not.have.been.called;
        error.should.be.defined;
        error.code.should.equal(400);
        error.message.should.equal(
          'Invalid task: ' +
          'the text is mandatory');
      });
    });
  });
});
