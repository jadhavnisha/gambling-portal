'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addConstraint('contestants', ['userId', 'contestId'], {
      type: 'unique',
      name: 'unique_contestant_accross_contest'
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('contestants', 'unique_contestant_accross_contest');
  } 
};
