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

const LAXMI = new web3.eth.Contract(laxmiArtifacts.abi, '0x01e510e5039ccc4068b5bb3b5ca557111ddccbed')

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

web3Obj.createAccount = createAccount;
web3Obj.transfer = transfer;
module.exports = web3Obj;
