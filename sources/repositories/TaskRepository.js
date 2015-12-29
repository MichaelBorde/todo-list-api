'use strict';

var util = require('util');
var BaseRepository = require('@arpinum/backend').BaseRepository;

function TaskRepository(database) {
  BaseRepository.call(this, database, 'tasks');
}

util.inherits(TaskRepository, BaseRepository);

module.exports = TaskRepository;
