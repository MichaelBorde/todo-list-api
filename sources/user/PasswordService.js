'use strict';

var Bluebird = require('bluebird');
var bcrypt = Bluebird.promisifyAll(require('bcrypt'));

function PasswordService() {
  this.compareWithUser = compareWithUser;
  this.encrypt = encrypt;

  function compareWithUser(encrypt, user) {
    return bcrypt.compareAsync(encrypt, user.password);
  }

  function encrypt(plainText) {
    return bcrypt.genSaltAsync().then(function (salt) {
      return bcrypt.hashAsync(plainText || '', salt);
    });
  }
}

module.exports = PasswordService;
