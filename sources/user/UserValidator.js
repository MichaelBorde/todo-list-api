'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var log = require('../tools/log')(__filename);

function UserValidator(repositories) {
  this.validate = validate;

  function validate(user) {
    var validation = {valid: true};
    return Bluebird
      .all([validateEmailUnicity()])
      .return(validation);

    function validateEmailUnicity() {
      return repositories.user.exist({email: user.email}).then(function (existing) {
        if (existing) {
          log.debug('Existing user:', user.email);
          validation.valid = false;
          validation.errors = _.union([], validation.errors, ['EXISTING_EMAIL']);
        }
      });
    }
  }
}

module.exports = UserValidator;
