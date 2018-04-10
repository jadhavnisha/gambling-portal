'use strict';
const bcrypt = require('bcrypt');
const web3 = require('../on-chain/server');

module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        len: {
          args: [2, 30],
          msg: 'Invalid input value for firstName'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        len: {
          args: [2, 30],
          msg: 'Invalid input value for lastName'
        }
      }
    },
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { 
        isEmail:true
      }
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: { 
        len: {
          args: [2, 30],
          msg: 'Invalid input value for lastName'
        }
      }
    },
    publicKey: { 
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^(0x)?[0-9a-f]{40}$/i,
          msg: 'Invalid input value for publicKey'
        }
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN
    },
    balance: {
      type: DataTypes.VIRTUAL
    },
    chainPassword: {
      type: DataTypes.VIRTUAL
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  user.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10)
    .then(hashedPw => {
      user.password = hashedPw
    })
    .catch(error => error);
  });

  user.afterCreate((user, options) => {
    var account = web3.createAccount(options.chainPassword);
    var update_user = account.then(publickey => {
      return user.update({
        publicKey: publickey
      },{
        where: {
          id:user.id
        },
      },{
        returning:true
      });
    });

    return Promise.all([account, update_user])
    .then(([publickey, user])=> {
      return web3.transfer(publickey);
    })
    .catch(error => console.log(error));
  });

  function authenticate(email, password) {   
    return user.findOne({ 
      where: {
        email: email
      }
    })
    .then(user => {
      if (user == null) {
        var err = new Error("User not found");
        err.status = 401;
        throw err;
      }
      var result = bcrypt.compareSync(password, user.password);
      if (result === true) {
        return user;
      } else {
        var err = new Error("Email/password doesn't match");
        throw err;
      }
    })
  }

  function getBalance(user) {
    return web3.getBalance(user.publicKey)
    .then(balance => {
      user.balance = balance;
      return user
    });
  }

  function getById(user_id){
    return user.findById(user_id)
    .then(user => {
      if(user == null) {
        var err = new Error("User not found");
        err.status = 401;
        throw err;
      }
      return user
    })
  }

  user.authenticate = authenticate;
  user.getBalance = getBalance;
  user.getById = getById;

  return user;
};