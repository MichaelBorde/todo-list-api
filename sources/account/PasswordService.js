'use strict';

var Bluebird = require('bluebird');
var bcrypt = Bluebird.promisifyAll(require('bcrypt'));

function PasswordService() {
  this.compareWithAccount = compareWithAccount;
  this.encrypt = encrypt;

  function compareWithAccount(encrypt, account) {
    return bcrypt.compareAsync(encrypt, account.password);
  }

  function encrypt(plainText) {
    return bcrypt.genSaltAsync().then(function (salt) {
      return bcrypt.hashAsync(plainText || '', salt);
    });
  }
}

module.exports = PasswordService;
