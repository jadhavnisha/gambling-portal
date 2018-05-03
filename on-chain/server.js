const Web3 = require('web3');
// const net = require('net');
var web3 = new Web3();
if (typeof web3 !== 'undefined' && web3.currentProvider) {
  web3 = new Web3(web3.currentProvider);
} else {
 // web3= new Web3(new Web3.providers.IpcProvider('/home/synerzip/projects/geth/node1/geth.ipc', net));
  web3 = new Web3(new Web3.providers.WebsocketProvider('ws://34.242.126.132:8548'));
}
web3.eth.getCoinbase()
.then(coinbase => {
  web3.eth.defaultAccount = coinbase
})

module.exports = web3;