pragma solidity >= 0.4.0 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Factory.sol";

contract HashContract is Ownable{
    
    string public firstName;
    string public lastName;
    string private hash;
    Factory public factory;
    uint createdAt;

    constructor(string memory _firstName, string memory _lastName, string memory _hash, Factory _factory) public {
        
        firstName = _firstName;
        lastName = _lastName;
        hash = _hash;
        factory = _factory;
        createdAt = block.timestamp;
        
    }
    

    function getHash() public view returns(string memory){
        require(block.timestamp - createdAt >= 2 minutes, "Required Time has not elapsed");
        return hash;
    }
}