'use strict';

var TokenService = require('@arpinum/backend').TokenService;

module.exports = {
  EMAIL: 'michael@mail.fr',
  PASSWORD: 'motDePasse',
  PASSWORD_IN_BCRYPT: '$2a$04$NvsfJgNCDDVMTn6l6qUfH.CMqbyngq2XR/xLv8vTX3NwkENIywG6S',
  JWT_REGEX: new RegExp('.*\..*\..*'),
  ENCODED_JWT_TOKEN: new TokenService().create({email: 'michael@mail.fr'}),
  DECODED_JWT_TOKEN: {email: 'michael@mail.fr'},
  USER: {email: 'michael@mail.fr', 'prénom': 'michael'},
  UUID_REGEX: /.{8}-.{4}-.{4}-.{4}-.{12}/
};
