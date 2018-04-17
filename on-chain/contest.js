const contestArtifacts = require('./build/contracts/ContestResult.json');
var web3 = require('./server.js');
const web3Obj = {}

const CONTESTS = new web3.eth.Contract(contestArtifacts.abi, '0xd50648b9e572c639bb3f4394e166888819accb89')

setContestResult = (_contestAddress, encrypted_result) => {
  CONTESTS.methods.setContestResult(_contestAddress, encrypted_result)
  .send({from: web3.eth.defaultAccount},function(error, transactionHash){
    if(error) {
      console.log(error);
      return error;
    }
    console.log(transactionHash);
    return transactionHash
  })
};

getContestResult = (_contestAddress) => {
  return CONTESTS.methods.getResult(_contestAddress)
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

web3Obj.setContestResult = setContestResult;
web3Obj.getContestResult = getContestResult;
module.exports = web3Obj;
