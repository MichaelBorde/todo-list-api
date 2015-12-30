'use strict';

module.exports = function (repositories) {
  return function (id) {
    return repositories.task.delete({id: id}).return();
  };
};
