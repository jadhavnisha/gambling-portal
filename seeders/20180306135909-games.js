'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('games', [{
        name: 'Hi-lo',
        createdAt : new Date(),
        updatedAt : new Date(),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('games', null, {});
  }
};
