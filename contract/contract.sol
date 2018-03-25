pragma solidity ^0.4.0;

contract Chain{
    struct ownerList{
        mapping(uint256=>address) owners;
        uint256 total;
    }
    
    mapping(string=>ownerList) allHistory;
    
    event newItemAdded(string item,address indexed owner);
    event newOwnerAdded(string item,address indexed newOwner,address indexed currentOwner);
    
    function addNewItem(string item) public returns(bool){
        ownerList memory m = allHistory[item];
        require(m.total == 0);
        allHistory[item].total = 1;
        allHistory[item].owners[0] = msg.sender;
        emit newItemAdded(item,msg.sender);
        return true;
    }
    
    function addNewOwner(string item,address newOwner) public returns(bool){
        uint256 t = allHistory[item].total;
        require(allHistory[item].owners[t-1] == msg.sender);
        allHistory[item].owners[t] = newOwner;
        allHistory[item].total = t+1;
        emit newOwnerAdded(item,newOwner,msg.sender);
        return true;
    }
    
    function getCurrentOwner(string item) public view returns(address){
        uint256 t = allHistory[item].total;
        return allHistory[item].owners[t-1];
    }
}