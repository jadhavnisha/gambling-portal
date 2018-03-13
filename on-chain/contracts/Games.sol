pragma solidity ^0.4.18;

contract Games {
    
    // game instance information
    struct GameInstance {
        string game_name;
        string encrypted_result;
    }
    
    mapping (address => GameInstance) gameInstances;// mapping of instance address with its details
    address[] public gameInstanceAccounts;//public address array of all game instances
    
    address owner;// application account
   
    function Games() public{
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function setGameInstance(address _address, string _game_name, string _encrypted_result) onlyOwner public {
        var instance = gameInstances[_address];
        
        instance.game_name = _game_name;
        instance.encrypted_result = _encrypted_result;
        
        gameInstanceAccounts.push(_address) -1;
    }
    
    function getGameInstances() view public returns(address[]) {
        return gameInstanceAccounts;
    }
    
    function getGameInstance(address _address) view public returns (string, string) {
        return (gameInstances[_address].game_name, gameInstances[_address].encrypted_result);
    }    
}