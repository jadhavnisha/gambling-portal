'use strict';
const web3 = require('../on-chain/token');

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
    },
    drawTime: {
      type: DataTypes.DATE,
      isDate: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      isIn: [['created', 'active', 'finished']],
    },
    config: {
      type: DataTypes.JSONB,
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
    return account.then(publickey => {
      return contest.update({
        publicKey: publickey
      },{
        where: {
          id:contest.id
        },
      },{returning:true})
    })
    .then(result => result)
    .catch(error => console.log(error));
  });

  function setEncryptionKey(encryption_key, contest_id) {
    var contestByID =  getById(contest_id);
    var contestToSave = contestByID.then(contest => {
      contest.config['encryption_key'] = encryption_key;
      contest.config = contest.config;
      contest.status = 'active';
      contest.startTime = Date.now();
      return contest.save();
    });

    return Promise.all([contestByID,contestToSave]).then(function([updatedContest, contest]) {
      return contest;
    })
    .catch(error => console.log);
  }

  function setResult(result, verifiedResult, contest) {
    contest.result = result;
    contest.drawTime = Date.now();
    contest.status = 'finished';
    contest.config['verified_result'] = verifiedResult;
    contest.config = contest.config;
    return contest.save()
    .then(self => self )
    .catch(error => console.log);
  }

  function getById(contest_id){
    return contest.findById(contest_id)
    .then(contest => {
      if(contest == null) {
        var err = new Error("contest not found");
        err.status = 401;
        throw err;
      }
      return contest
    })
  }

  contest.setEncryptionKey = setEncryptionKey;
  contest.setResult = setResult;
  contest.getById = getById;
  return contest;
};