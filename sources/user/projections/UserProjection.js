'use strict';

function UserProjection(database) {
  var collection = 'users.projection';

  var self = this;
  self.onUserAddedEvent = onUserAddedEvent;
  self.findFirst = findFirst;

  function onUserAddedEvent(eventData) {
    return database.add(collection, eventData);
  }

  function findFirst(criteria) {
    return database.findFirst(collection, criteria);
  }
}

module.exports = UserProjection;
