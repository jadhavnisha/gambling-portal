const Web3 = require('web3');
var web3 = new Web3();
if (typeof web3 !== 'undefined' && web3.currentProvider) {
  web3 = new Web3(web3.currentProvider);
} else {
  web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"))
}
web3.eth.getCoinbase()
.then(coinbase => {web3.eth.defaultAccount = coinbase})

module.exports = web3;