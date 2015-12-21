'use strict';

var util = require('util');
var BaseRepository = require('./BaseRepository');

function AccountRepository(database) {
  BaseRepository.call(this, database, 'accounts');
}

util.inherits(AccountRepository, BaseRepository);

module.exports = AccountRepository;
