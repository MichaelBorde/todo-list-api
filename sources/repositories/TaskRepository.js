'use strict';

var util = require('util');
var BaseRepository = require('@arpinum/backend').BaseRepository;

function InvitationRepository(database) {
  BaseRepository.call(this, database, 'tasks');
}

util.inherits(InvitationRepository, BaseRepository);

module.exports = InvitationRepository;
