'use strict';
const bcrypt = require('bcrypt');

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
      allowNull: false,
      validate: {
        is: {
          args: /^(0x)?[0-9a-f]{40}$/i,
          msg: 'Invalid input value for publicKey'
        }
      }
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
    .then(hashedPw => user.password = hashedPw)
    .catch(error => error);
  });
  return user;
};