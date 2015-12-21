'use strict';

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
        return repositories.account.add(newAccount).then(function () {
          creation.account = newAccount;
        });
      });
    }

    function createUser() {
      log.info('User creation for', account.email);
      var user = {
        email: account.email
      };
      return repositories.user.add(user).then(function (withId) {
        creation.user = withId;
      });
    }

    function createdAccount() {
      return creation.account;
    }

    function handleError(error) {
      log.debug('Error during account creation, all related data will be removed');
      var deletionPromises = [];
      if (creation.user) {
        deletionPromises.push(repositories.user.supprimeDéfinitivement({id: creation.user.id}));
      }
      if (creation.account) {
        deletionPromises.push(repositories.account.supprimeDéfinitivement({id: creation.account.id}));
      }
      return Bluebird.all(deletionPromises).throw(error);
    }
  }
}

module.exports = AccountFactory;
