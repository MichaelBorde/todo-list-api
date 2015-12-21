'use strict';

var util = require('util');
var BaseRepository = require('./BaseRepository');

function InvitationRepository(database) {
  BaseRepository.call(this, database, 'tasks');
}

util.inherits(InvitationRepository, BaseRepository);

module.exports = InvitationRepository;
