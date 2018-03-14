'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('contests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      drawTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,        
      },
      config: {
        type: Sequelize.JSON
      },
      publicKey: {
        type: Sequelize.STRING,
      },
      result: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      gameId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'games'
          },
          key: 'id'
        },
        allowNull: false        
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('contests');
  }
};