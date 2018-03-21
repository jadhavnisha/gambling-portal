const Web3 = require('web3');
const gameArtifacts = require('./build/contracts/Games.json');
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

const GAMES = new web3.eth.Contract(gameArtifacts.abi, '0x9251e8b5873fd9038ac344788b8938d5d251bad6')

setGameInstance = (_address, encrypted_result) => {
  // console.log('hereeeeeeeeeeeeeeeeee', _to,web3.eth.defaultAccount)
  GAMES.methods.setGameInstance(_address, encrypted_result)
  .send({from: web3.eth.defaultAccount},function(error, transactionHash){
    if(error) {
      console.log(error);
      return error;
    }
    console.log(transactionHash);
    return transactionHash
  })
};

getGameInstance = (_address) => {
  return GAMES.methods.getGameInstance(_address)
  .call({from: web3.eth.defaultAccount})
  .then(result => {
    console.log('adadaa',result);
    return result
  })
  .catch(error => {
      console.log(error);
      return error;
  })
}

web3Obj.setGameInstance = setGameInstance;
web3Obj.getGameInstance = getGameInstance;
module.exports = web3Obj;
