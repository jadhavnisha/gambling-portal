var Laxmi = artifacts.require("./Laxmi.sol");
var Games = artifacts.require("./Games.sol");

module.exports = function(deployer) {
  deployer.deploy(Laxmi, 100000000);
  deployer.deploy(Games);
};
