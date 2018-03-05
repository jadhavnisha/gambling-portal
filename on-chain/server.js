const Web3 = require('web3');
const laxmiArtifacts = require('./build/contracts/Laxmi.json');
const web3Obj = {}

var web3 = new Web3();
if (typeof web3 !== 'undefined' && web3.currentProvider) {
  web3 = new Web3(web3.currentProvider);
} else {
  web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"))
}
console.log(web3.currentProvider);
web3.eth.getCoinbase()
.then(coinbase => {web3.eth.defaultAccount = coinbase});

const LAXMI = new web3.eth.Contract(laxmiArtifacts.abi, '0x7c7b1878eb02a72afaa0011340311987cb088fd2')

createAccount = () => {
  return web3.eth.accounts.create();
};

transfer = (_to) => {
  console.log('hereeeeeeeeeeeeeeeeee', _to,web3.eth.defaultAccount)
  LAXMI.methods.transfer(_to, 200000)
  .send({from: web3.eth.defaultAccount},function(error, transactionHash){
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
