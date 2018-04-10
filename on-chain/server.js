const Web3 = require('web3');
const laxmiArtifacts = require('./build/contracts/Laxmi.json');
const web3Obj = {}

var web3 = new Web3();
if (typeof web3 !== 'undefined' && web3.currentProvider) {
  web3 = new Web3(web3.currentProvider);
} else {
  web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"))
}
web3.eth.getCoinbase()
.then(coinbase => {web3.eth.defaultAccount = coinbase});

const LAXMI = new web3.eth.Contract(laxmiArtifacts.abi, '0x866d978302e37a349df886698ad835e50cb5c7f8')

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
