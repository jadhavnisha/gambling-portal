pragma solidity ^0.4.18;

contract Games {
    
    string encrypted_result;
    // game instance information
    /** 
      Below function commented out, as we are going to store only
      encrypted result of a game instance on blockchain, we can use
      this struct if more data required to store related to game
    **/
    // struct GameInstance {
    //     string game_name;
    //     byte32 encrypted_result;
    // }
    
    mapping (address => string) gameInstances;// mapping of game instance address with its result
    address[] public gameInstanceAccounts;//public address array of all game instances
    
    address owner;// application account
   
    function Games() public{
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function setGameInstance(address _address, string _encrypted_result) onlyOwner public {
        gameInstances[_address] = _encrypted_result;
        
        gameInstanceAccounts.push(_address) -1;
    }
    
    function getGameInstances() view public returns(address[]) {
        return gameInstanceAccounts;
    }
    
    function getGameInstance(address _address) view public returns (string) {
        return (gameInstances[_address]);
    }    
}