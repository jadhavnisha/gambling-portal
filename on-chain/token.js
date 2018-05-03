const laxmiArtifacts = require('./build/contracts/Laxmi.json');
var web3 = require('./server.js');
const web3Obj = {}

const LAXMI = new web3.eth.Contract(laxmiArtifacts.abi, '0x8754a63affb4f38cd697662f9c698b3e2c9aefcb')

LAXMI.events.Transfer()
.on('data', function(event){
  console.log('data',event); // same results as the optional callback above
})
.on('changed', function(event){
  // remove event from local database
  console.log('changed',event)
})
.on('error', console.error);

createAccount = (passphrase=process.env.CONTEST_PASS) => {
  return web3.eth.personal.newAccount(passphrase).then(publickey => {
    return publickey;
  });
};

unlockAccount = (publickey, passphrase=process.env.CONTEST_PASS) => {
  return web3.eth.personal.unlockAccount(publickey, passphrase, 200)
  .then(result => {
    return web3.eth.sendTransaction({
        from: web3.eth.defaultAccount,
        gasPrice: "20000000000",
        gas: "21000",
        to: publickey,
        value: "1800000000000000",
        data: ""
    },passphrase)
  })
  .then(console.log)
};

transfer = (_to, _amount=200000, _from = web3.eth.defaultAccount) => {
  console.log('hereeeeeeeeeeeeeeeeee', _to,_from)
  LAXMI.methods.transfer(_to, _amount)
  .send({from: _from})
  .on('transactionHash', function(hash){
    console.log('transactionHash',hash);
  })
  .on('receipt', function(receipt){
    console.log('receipt',receipt);
  })
  .on('confirmation', function(confirmationNumber, receipt){
    console.log('confirmationNumber',confirmationNumber);  
  })
  .on('error', console.error);
  // .then(transactionHash => {
  //   // console.log(transactionHash);
  //   return transactionHash
  // })
  // .catch(error => {
  //   console.log(error);
  //   throw error;
  // });
};

clearAccount = (_from) => {
  var collect = getBalance(_from);
  var unlock = collect.then(collectedAmount => {
    return unlockAccount(_from);
  })

  return Promise.all([collect, unlock])
  .then(([collectedAmount, unlockedAccount]) => {
    console.log('collect',_from, web3.eth.defaultAccount, collectedAmount);
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
