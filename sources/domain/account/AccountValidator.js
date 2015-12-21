'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var log = require('../../tools/log')(__filename);

function AccountValidator(repositories) {
  this.validate = validate;

  function validate(account) {
    var validation = {valid: true};
    return Bluebird
      .all([validateEmailUnicity()])
      .return(validation);

    function validateEmailUnicity() {
      return repositories.account.exist({email: account.email}).then(function (existing) {
        if (existing) {
          log.debug('Existing account:', account.email);
          validation.valid = false;
          validation.errors = _.union([], validation.errors, ['EXISTING_EMAIL']);
        }
      });
    }
  }
}

module.exports = AccountValidator;
