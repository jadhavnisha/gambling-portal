const models = require('../models/index');
const cryptoObj = require('../helpers/crypto');
const contestService = {};
const web3 = require('../on-chain/game');

start = function(contest_id){ 
  var passphrase = cryptoObj.randomValueHex();
  return models.contest.setEncryptionKey(passphrase, contest_id)
  .then(contest => {  
    var result = Math.floor(Math.random()*(6*contest.config.number_of_dice));
    var encrypted_result = cryptoObj.encrypt(result.toString(), passphrase);
    web3.setGameInstance(contest.publicKey, encrypted_result);
    return contest;
  }); 
}

draw = function(contest_id){
  var contestByID = models.contest.getById(contest_id)
  var gameInstance= contestByID.then(contest => {
    return web3.getGameInstance(contest.publicKey)
  });
  
  return Promise.all([contestByID, gameInstance])
  .then(function([contest, encrypted_result]) {
    var decrypted_result = cryptoObj.decrypt(encrypted_result.toString(), contest.config.encryption_key);
    return models.contest.setResult(decrypted_result, contest.id)
  })
  .then(rows => {
    if(rows[0]==0){
      var err = new Error("draw not updated");
      err.status = 401;
      throw err;
    }
    return models.contest.getById(contest_id);
  })
  .then(contest => contest)
  .catch(error => error);
}

contestService.start = start;
contestService.draw = draw;
module.exports = contestService;