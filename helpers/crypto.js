const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

const cryptoObj = {};

randomValueHex = function() {
  var len = 32
  return crypto.randomBytes(Math.ceil(len/2))
  .toString('hex') // convert to hexadecimal format
  .slice(0,len).toUpperCase();   // return required number of characters
}

encrypt = function(text, password){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

decrypt = function(text, password){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

cryptoObj.randomValueHex = randomValueHex;
cryptoObj.encrypt = encrypt;
cryptoObj.decrypt = decrypt;

module.exports = cryptoObj