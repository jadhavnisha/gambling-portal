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

  function setResult(result, contest_id) {
    return contest.update({
      result: result,
      drawTime: Date.now(),
      status: 'finished'
    },{
      where: {
        id:contest_id,
        status: 'active'
      },
    },{
      returning:true,
      plain: true
    })
    .then(self => self )
    .catch(error => console.log);
  }

  function getById(contest_id){
    return contest.findById(contest_id)
    .then(contest => {
      if(contest == null) {
        var err = new Error("User not found");
        err.status = 401;
        throw err;
      }
      return contest
    })
  }

  function getByStatusAndId(status, contest_id){
    var whereCondition = {status: status, gameId: contest_id };
    return contest.findAll({
      where: whereCondition
    })
    .then(contest => {
      if(contest == null) {
        var err = new Error("User not found");
        err.status = 401;
        throw err;
      }
      return contest
    })
  }

  contest.setEncryptionKey = setEncryptionKey;
  contest.setResult = setResult;
  contest.getById = getById;
  contest.getByStatusAndId = getByStatusAndId;
  return contest;
};