var Laxmi = artifacts.require("./Laxmi.sol");

module.exports = function(deployer) {
  deployer.deploy(Laxmi, 100000000);
};
