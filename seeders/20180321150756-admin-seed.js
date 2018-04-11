'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      firstName : 'John',
      lastName : 'Doe',
      email : 'johnDoe@test.com',
      password: '$2a$10$jGZYNcZSOFsKP..pWe9Xtu3LaIK2rEXVydGkiSMmMZ9edMD8bKnFm',
      publicKey: '0x4039184b25d6aa5c9195debb0c0694a58fbba25f',
      createdAt : new Date(),
      updatedAt : new Date(),
      isAdmin: true
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {isAdmin:true}, {});
  }
};
