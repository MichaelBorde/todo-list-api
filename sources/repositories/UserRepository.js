'use strict';

var util = require('util');
var BaseRepository = require('@arpinum/backend').BaseRepository;

function UserRepository(database) {
  BaseRepository.call(this, database, 'users');
}

util.inherits(UserRepository, BaseRepository);

module.exports = UserRepository;
