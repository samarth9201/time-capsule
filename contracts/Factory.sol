pragma solidity >= 0.4.0 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./HashContract.sol";

contract Factory is Ownable{
    
    mapping(string => HashContract) private  hashContracts;

    function addHash(string memory _firstName, string memory _lastName, string memory _hash) public {
        require(hashContracts[_hash] == HashContract(address(0)), "Hash is already in use");
        HashContract _hashContract = new HashContract(_firstName, _lastName, _hash, this);
        hashContracts[_hash] = _hashContract;
    }

    function clearHash(string memory _hash) public onlyOwner{
        hashContracts[_hash] = HashContract(address(0));
    }
    
    function getContract(string memory hash) public view returns(HashContract){
        return hashContracts[hash];
    }
}