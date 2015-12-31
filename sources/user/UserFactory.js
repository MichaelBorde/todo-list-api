'use strict';

var PasswordService = require('./PasswordService');

function UserFactory(repositories) {
  this.create = create;

  function create(user) {
    return new PasswordService().encrypt(user.password).then(function (encryptedPassword) {
      var newUser = {
        id: user.id,
        email: user.email,
        password: encryptedPassword
      };
      return repositories.user.add(newUser).return(newUser);
    });
  }
}

module.exports = UserFactory;
