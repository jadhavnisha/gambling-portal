'use strict';
const web3 = require('../on-chain/server');

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
        contestant.belongsTo(models.user);
        contestant.belongsTo(models.contest);
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
        var userPub = contestPub.then(contestPub => {
          sequelize.models.user.findById(contestant.userId)
        })

        Promise.all([contestPub, userPub]).then(([_to, _from])=> {
          web3.transfer(_to, _from, contestant.bid);
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

  return contestant;
};