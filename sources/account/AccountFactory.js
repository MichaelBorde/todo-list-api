'use strict';

var PasswordService = require('./PasswordService');

function AccountFactory(repositories) {
  this.create = create;

  function create(account) {
    return new PasswordService().encrypt(account.password).then(function (encryptedPassword) {
      var newAccount = {
        id: account.id,
        email: account.email,
        password: encryptedPassword
      };
      return repositories.account.add(newAccount).return(newAccount);
    });
  }
}

module.exports = AccountFactory;
