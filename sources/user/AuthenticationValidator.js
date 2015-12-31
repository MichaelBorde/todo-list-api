'use strict';

var _ = require('lodash');
var PasswordService = require('./PasswordService');
var log = require('../tools/log')(__filename);

function AuthenticationValidator(repositories) {
  this.validate = validate;

  function validate(authentication) {
    return userWithEmail().then(function (count) {
      if (!count) {
        log.debug('No user for the given email');
        return {valid: false, errors: ['User_NOT_FOUND']};
      }
      return new PasswordService().compareWithUser(authentication.password, count)
        .then(function (comparison) {
          if (!comparison) {
            log.debug('Wrong password');
            return {valid: false, errors: ['WRONG_PASSWORD']};
          }
          return {valid: true};
        });
    });

    function userWithEmail() {
      var promise = repositories.user.findAll({email: authentication.email});
      return promise.then(function (users) {
        return _.first(users);
      });
    }
  }
}

module.exports = AuthenticationValidator;
