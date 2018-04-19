'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      firstName : 'John',
      lastName : 'Doe',
      email : 'admin@test.com',
      password: '$2a$10$jGZYNcZSOFsKP..pWe9Xtu3LaIK2rEXVydGkiSMmMZ9edMD8bKnFm',
      publicKey: '0x0581daebbf60cec5c853bed1c8bd0e232b3e1b07',
      createdAt : new Date(),
      updatedAt : new Date(),
      isAdmin: true
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {isAdmin:true}, {});
  }
};
