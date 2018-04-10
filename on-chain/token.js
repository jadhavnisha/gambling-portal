const laxmiArtifacts = require('./build/contracts/Laxmi.json');
var web3 = require('./server.js');
const web3Obj = {}

const LAXMI = new web3.eth.Contract(laxmiArtifacts.abi, '0x646ca4f1c9339b7f91d1d9852f9a5205a2088b13')

// LAXMI.events.Transfer(function(error, event) {
//   console.log(error);
//   console.log(event);
// });
// .on('data', function(event){
//   console.log('data',event); // same results as the optional callback above
// })
// .on('changed', function(event){
//   // remove event from local database
//   console.log('changed',event)
// })
// .on('error', console.error);

createAccount = (passphrase='test') => {
  // return web3.eth.accounts.create();
  return web3.eth.personal.newAccount(passphrase).then(publickey => {
    console.log('publickey===',publickey);
    return publickey;
  });
};

unlockAccount = (publickey, passphrase='test') => {
  web3.eth.personal.unlockAccount(publickey, passphrase, 200)
  web3.eth.sendTransaction({
      from: web3.eth.defaultAccount,
      gasPrice: "20000000000",
      gas: "21000",
      to: publickey,
      value: "1800000000000000",
      data: ""
  },passphrase)
  .then(console.log)
  .catch(console.log);
};

transfer = (_to, _amount=200000, _from = web3.eth.defaultAccount) => {
  console.log('hereeeeeeeeeeeeeeeeee', _to,_from)
  LAXMI.methods.transfer(_to, _amount)
  .send({from: _from},function(error, transactionHash){
    if(error) {
      console.log(error);
      return error;
    }
    console.log(transactionHash);
    return transactionHash
  })
};

clearAccount = (_from) => {
  getBalance(_from)
  .then(collectedAmount => {
    console.log('collect',_from, web3.eth.defaultAccount, collectedAmount);
    unlockAccount(_from);
    return transfer(web3.eth.defaultAccount, collectedAmount, _from);
  })
}
getBalance = (_ofAddress) => {
  return LAXMI.methods.balanceOf(_ofAddress).call()
  .then(i => {return(i)});
}

web3Obj.createAccount = createAccount;
web3Obj.unlockAccount = unlockAccount;
web3Obj.transfer = transfer;
web3Obj.clearAccount = clearAccount;
web3Obj.getBalance = getBalance;
module.exports = web3Obj;
