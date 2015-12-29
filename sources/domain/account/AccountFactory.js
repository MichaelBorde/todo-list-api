'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var ServiceMotDePassee = require('./PasswordService');
var log = require('../../tools/log')(__filename);

function AccountFactory(repositories) {
  this.create = create;

  function create(account) {
    var creation = {};
    return createAccount()
      .then(createUser)
      .then(createdAccount)
      .catch(handleError);

    function createAccount() {
      return new ServiceMotDePassee().encrypt(account.password).then(function (encryptedPassword) {
        var newAccount = {
          email: account.email,
          password: encryptedPassword
        };
        return repositories.account.add(newAccount).then(function (withId) {
          creation.account = _.merge({}, newAccount, withId);
        });
      });
    }

    function createUser() {
      log.info('User creation for', account.email);
      var newUser = {
        email: account.email
      };
      return repositories.user.add(newUser).then(function (withId) {
        creation.user = _.merge({}, newUser, withId);
      });
    }

    function createdAccount() {
      return creation.account;
    }

    function handleError(error) {
      log.debug('Error during account creation, all related data will be removed');
      var deletionPromises = [];
      if (creation.user) {
        deletionPromises.push(repositories.user.delete({id: creation.user.id}));
      }
      if (creation.account) {
        deletionPromises.push(repositories.account.delete({id: creation.account.id}));
      }
      return Bluebird.all(deletionPromises).throw(error);
    }
  }
}

module.exports = AccountFactory;
