'use strict';
const web3 = require('../on-chain/token');

module.exports = (sequelize, DataTypes) => {
  var contestant = sequelize.define('contestant', {
    bid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      notEmpty: true,
      validate: {
        isNumeric: true,
        min:10
      }
    },
    prediction: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        len: {
          args: [2, 10],
          msg: 'Invalid input value for contest name'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      }
    },
    contestId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Contest',
        key: 'id',
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      beforeCreate:function(contestant, options) {
        return sequelize.models.contest.getById(contestant.contestId)
        .then(contest => {
          if(contest.status!= 'active'){
            var err = new Error("please bid against active contest");
            err.status = 401;
            throw err;
          }
        })
      },
      afterCreate:function(contestant, options) {
        var contestPub = sequelize.models.contest.findById(contestant.contestId)
        .then(contest => {
          return contest.publicKey;
        })
        var user = contestPub.then(contestPub => {
          return sequelize.models.user.findById(contestant.userId)
        })

        var unlock = user.then(user=> {
          return web3.unlockAccount(user.publicKey, options.chainPassword);
        })

        return Promise.all([contestPub, user, unlock])
        .then(([_to, user, unlockedAccount])=> {
          return web3.transfer(_to, contestant.bid, user.publicKey);
        })
        .catch(error => {
          console.log(error);
          return error;
        })
      }
    },
    indexes: [
        {
            unique: true,
            fields: ['userId', 'contestId']
        }
    ]
  });

  function isUserParticipated(contestId, userId){
    var whereCondition = {contestId: contestId, userId: userId };
    return contestant.count({
      where: whereCondition
    })
    .then(contestant => {
      return !!contestant;
    })
  }

  contestant.isUserParticipated = isUserParticipated;
  return contestant;
};