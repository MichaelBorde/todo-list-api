'use strict';

var _ = require('lodash');
var PasswordService = require('../../domain/account/PasswordService');
var log = require('../../tools/log')(__filename);

function AuthenticationValidator(repositories) {
  this.validate = validate;

  function validate(authentication) {
    return accountWithEmail().then(function (count) {
      if (!count) {
        log.debug('No account for the given email');
        return {valid: false, errors: ['ACCOUNT_NOT_FOUND']};
      }
      return new PasswordService().compareWithAccount(authentication.password, count)
        .then(function (comparison) {
          if (!comparison) {
            log.debug('Wrong password');
            return {valid: false, errors: ['WRONG_PASSWORD']};
          }
          return {valid: true};
        });
    });

    function accountWithEmail() {
      var promise = repositories.account.findAll({email: authentication.email});
      return promise.then(function (accounts) {
        return _.first(accounts);
      });
    }
  }
}

module.exports = AuthenticationValidator;
