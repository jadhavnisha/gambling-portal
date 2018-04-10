var Laxmi = artifacts.require("./Laxmi.sol");
var ContestResult = artifacts.require("./ContestResult.sol");

module.exports = function(deployer) {
  deployer.deploy(Laxmi, 100000000);
  deployer.deploy(ContestResult);
};
