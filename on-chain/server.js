const Web3 = require('web3');
var web3 = new Web3();
var net = require('net');

if (typeof web3 !== 'undefined' && web3.currentProvider) {
  web3 = new Web3(web3.currentProvider);
} else {
  // web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
// web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8546"))
var web3 = new Web3(new Web3.providers.IpcProvider('/home/synerzip/projects/geth/node1/geth.ipc', net)); // mac os path

}
web3.eth.getCoinbase()
.then(coinbase => {web3.eth.defaultAccount = coinbase})

module.exports = web3;