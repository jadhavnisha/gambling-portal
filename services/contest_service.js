const models = require('../models/index');
const cryptoObj = require('../helpers/crypto');
const contestService = {};
const web3 = require('../on-chain/game');
const web3Obj = require('../on-chain/server');

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
    console.log('-------------------1')
    return models.contest.getById(contest_id);
  })
  .then(contest => sendReward(contest))
  .then(result => result)
  .catch(error => error);
}

sendReward = function(contest) {
  var prediction;
  if(contest.result < ((contest.config.number_of_dice*6)/2))
    prediction = 'lo'
  else
    prediction = 'hi'

  console.log('---------------3', prediction);
  return models.contest.findOne({
    include: [{
                model: models.user,
                through: {
                  where:{'prediction': prediction}
                }
            }],
    where: {
      id:contest.id
    }
  })
  .then(contest => {
    var winners = [];
    console.log('-----------4');
    contest.users.map(user => {
      var obj = { publicKey: user.publicKey };
      obj.bid = user.contestant.bid;
      return winners.push(obj);
    });
    console.log('-----------4', winners, contest.publicKey)
    web3Obj.clearAccount(contest.publicKey);
    winners.forEach(winner => web3Obj.transfer(winner.publicKey, winner.bid*2) );
    return contest
  })
}

contestService.start = start;
contestService.draw = draw;
module.exports = contestService;