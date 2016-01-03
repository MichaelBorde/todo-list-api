'use strict';

var _ = require('lodash');

function UserProjection(database) {
  var collection = 'tasks.projection';

  var self = this;
  self.onTaskAddedEvent = onTaskAddedEvent;
  self.onTaskDeletedEvent = onTaskDeletedEvent;
  self.onTaskPartiallyUpdatedEvent = onTaskPartiallyUpdatedEvent;
  self.findFirst = findFirst;
  self.findAll = findAll;

  function onTaskAddedEvent(eventData) {
    return database.add(collection, eventData);
  }

  function onTaskDeletedEvent(eventData) {
    return database.deleteFirst(collection, {id: eventData.id});
  }

  function onTaskPartiallyUpdatedEvent(eventData) {
    var update = _.omit(eventData, 'id');
    return database.updateFirst(collection, {id: eventData.id}, update);
  }

  function findFirst(criteria) {
    return database.findFirst(collection, criteria);
  }

  function findAll(criteria) {
    return database.findAll(collection, criteria);
  }
}

module.exports = UserProjection;
