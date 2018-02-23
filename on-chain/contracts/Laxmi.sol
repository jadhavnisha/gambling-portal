pragma solidity ^0.4.0;

contract Laxmi {
     
    mapping (address => uint256) public balanceOf;
    string public name;
    string public symbol;
    uint8 public decimals;

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function Laxmi(uint256 initialSupply) {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        name = "Laxmi";
        symbol = "LXM";
        decimals = 2;
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;          
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;
        balanceOf[msg.sender] -= _value;                    
        balanceOf[_to] += _value;                           
    }
}
