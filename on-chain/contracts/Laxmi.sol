pragma solidity ^0.4.2;

contract Laxmi {
     
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) allowed;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function Laxmi(uint256 initialSupply) public {
        name = "Laxmi";
        symbol = "LXM";
        decimals = 2;
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    /* Internal transfer called by this contract */
    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != 0x0);
        require(balanceOf[_from] >= _value);
        require(balanceOf[_to] + _value > balanceOf[_to]);
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        Transfer(_from, _to, _value);
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    function transfer(address _to, uint256 _value) public {
        _transfer(msg.sender, _to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool _success){
        require(_value <= allowed[_from][msg.sender]);
        allowed[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }


    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }
}
