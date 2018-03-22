'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      firstName : 'John',
      lastName : 'Doe',
      email : 'johnDoe@test.com',
      password: '$2a$10$jGZYNcZSOFsKP..pWe9Xtu3LaIK2rEXVydGkiSMmMZ9edMD8bKnFm',
      createdAt : new Date(),
      updatedAt : new Date(),
      isAdmin: true
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {isAdmin:true}, {});
  }
};
