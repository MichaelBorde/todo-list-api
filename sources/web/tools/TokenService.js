'use strict';

var jwt = require('jsonwebtoken');
var Bluebird = require('bluebird');
var jwtVerify = Bluebird.promisify(jwt.verify);
var configuration = require('../../tools/configuration');

function TokenService() {
  var self = this;
  self.create = create;
  self.verify = verify;

  function create(user) {
    var payload = {
      email: user.email
    };
    var options = {
      algorithm: 'HS256',
      expiresIn: configuration.authenticationExpirationInMinutes + 'm'
    };
    return jwt.sign(payload, configuration.jwtSecret, options);
  }

  function verify(jeton) {
    var options = {
      algorithm: 'HS256'
    };
    return jwtVerify(jeton, configuration.jwtSecret, options).then(function (payload) {
      return {email: payload.email};
    });
  }
}

module.exports = TokenService;
