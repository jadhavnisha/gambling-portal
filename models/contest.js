'use strict';
const web3 = require('../on-chain/server');

module.exports = (sequelize, DataTypes) => {
  var contest = sequelize.define('contest', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        len: {
          args: [2, 15],
          msg: 'Invalid input value for contest name'
        }
      }
    },
    startTime: {
      type: DataTypes.DATE,
      isDate: true,
      allowNull: false,
      notEmpty: true,
    },
    drawTime: {
      type: DataTypes.DATE,
      isDate: true,
      allowNull: false,
      notEmpty: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      isIn: [['created', 'active', 'finished']],
    },
    config: {
      type: DataTypes.JSON,      
    },  
    publicKey: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^(0x)?[0-9a-f]{40}$/i,
          msg: 'Invalid input value for public key'
        }
      }
    }, 
    result: {
      type: DataTypes.STRING,
    },
    gameId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Game',
        key: 'id',
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  
  contest.afterCreate((contest, options) => {
    var account = web3.createAccount();

    return contest.update({
      publicKey: account.address
    },{
      where: {
        id:contest.id
      },
    },{returning:true})
    .then(self => {web3.transfer(self.publicKey)} )
    .catch(error => console.log);
  });

  return contest;
};