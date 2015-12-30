'use strict';

module.exports = function (repositories) {
  return function run(id) {
    return repositories.task.delete({id: id}).return();
  };
};
