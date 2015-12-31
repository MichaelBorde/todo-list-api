'use strict';

module.exports = function (repositories, buses) {
  return function (user) {
    return repositories.user.add(user).then(function () {
      buses.event.broadcast('userAddedEvent', user);
    });
  };
};
