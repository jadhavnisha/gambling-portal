pragma solidity ^0.4.18;

contract ContestResult {    
    address owner;// application account
    string encrypted_result;
    mapping (address => string) contests;// mapping of game instance address with its result
    address[] public contestAccounts;//public address array of all game instances
   
    function ContestResult() public{
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function setContestResult(address _contestAddress, string _encrypted_result) onlyOwner public {
        contests[_contestAddress] = _encrypted_result;
        contestAccounts.push(_contestAddress) -1;
    }
    
    function getResult(address _contestAddress) view public returns (string) {
        return (contests[_contestAddress]);
    }    
}