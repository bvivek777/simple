const Web3 = require('web3');

let web3  = new Web3('ws://localhost:8546');

var chainContract = new web3.eth.Contract([{"constant":false,"inputs":[{"name":"item","type":"string"}],"name":"addNewItem","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"item","type":"string"}],"name":"getCurrentOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"item","type":"string"},{"name":"newOwner","type":"address"}],"name":"addNewOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"item","type":"string"},{"indexed":true,"name":"owner","type":"address"}],"name":"newItemAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"item","type":"string"},{"indexed":true,"name":"newOwner","type":"address"},{"indexed":true,"name":"currentOwner","type":"address"}],"name":"newOwnerAdded","type":"event"}],"0x8f36aaf2055806a0a5b8d46f136788d54fba7518");

exports.addNewItem = function (item,from,callback) {
	let ru = chainContract.methods.addNewItem(item);
	ru.estimateGas(function (error,gasAmount) {
		if(error){
			console.log(error)
			callback(null);
			return;
		}
		ru.send({
			from:from,
			gas:gasAmount
		}).then(function(result){
			console.log("Set User funtion called");
			callback(result);
			return;
		});
	});
}

exports.addNewOwner = function (item,to,from,callback) {
	let ano = chainContract.methods.addNewOwner(item,to);
	ano.estimateGas({ from:from },function (error,gasAmount) {
		if(error){
			console.log(error)
			callback(null);
			return;
		}else{
			ano.send({
				from:from,
				gas:gasAmount
			}).then(function(result){
				console.log("Set User funtion called");
				callback(result);
				return;
			});
		}
		
	});
}

exports.getCurrentOwner = function (item,from,callback) {
	chainContract.methods.getCurrentOwner(item).call({
		from:from
	}).then(function (result) {
		callback(result);
		return;
	})
}

exports.getAllEvents = function (address,callback) {
	chainContract.getPastEvents('allEvents',{
	    fromBlock: 0,
	    toBlock: 'latest'
	}, function(error, events){ 
		let bought = []
		for (var i = events.length - 1; i >= 0; i--) {
			if(events[i].returnValues.owner && (events[i].returnValues.owner.toLowerCase() == address.toLowerCase()))
				bought.push({ item:events[i].returnValues.item, action:"Registered" });
			else if (events[i].returnValues.currentOwner && (events[i].returnValues.currentOwner.toLowerCase() == address.toLowerCase()))
				bought.push({ item:events[i].returnValues.item, action:"Sold" });
			else if(events[i].returnValues.newOwner && (events[i].returnValues.newOwner.toLowerCase() == address.toLowerCase()))
				bought.push({ item:events[i].returnValues.item, action:"Bought" });
		}
		callback(bought);
	 });
	
}