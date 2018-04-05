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

const LAXMI = new web3.eth.Contract(laxmiArtifacts.abi, '0xeb97953117a7f1bcac033d94485fbf5e4342bedf')

LAXMI.events.Transfer(function(error, event) {console.log(event)})
.on('data', function(event){
  console.log('data',event); // same results as the optional callback above
})
.on('changed', function(event){
  // remove event from local database
  console.log('changed',event)
})
.on('error', console.error);

createAccount = () => {
  return web3.eth.accounts.create();
};

transfer = (_to, _from = web3.eth.defaultAccount, _amount=200000) => {
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

getBalance = (_ofAddress) => {
  return LAXMI.methods.balanceOf(_ofAddress).call()
  .then(i => {return(i)});
}

web3Obj.createAccount = createAccount;
web3Obj.transfer = transfer;
web3Obj.getBalance = getBalance;
module.exports = web3Obj;
