var express = require('express');
var router = express.Router();
var blockchain = require("../blockchain/blockchain");

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	blockchain.getAllEvents(req.user.address,function (result) {
		res.render('index',{
			history:result
		});
	});
});

router.post('/register/item',ensureAuthenticated,function (req,res) {
	var item = req.body.name;
	req.checkBody('name', 'Item Name is required').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		res.render('index',{
			errors:errors
		});
	}else{
		blockchain.addNewItem(item,req.user.address,function (result) {
			if(result){
				res.render("index",{
					success_msg:"You have succesfully registered a new item"
				});
			}else{
				res.render("index",{
					success_msg:'This item already seems to be registered'
				});
			}
		});
	}
});

router.post('/sell/item',ensureAuthenticated,function (req,res) {
	var item = req.body.name;
	var to = req.body.address
	req.checkBody('name','Item Name is required').notEmpty();
	req.checkBody('address',"receiver address is required").notEmpty();
	var errors = req.validationErrors();
	if(errors){
		res.render('index',{
			errors:errors
		});
	}else{
		blockchain.addNewOwner(item,to,req.user.address,function (result) {
			if(result){
				res.render("index",{
					success_msg:"You have succesfully sold the item to address"
				});
			}else{
				res.render("index",{
					success_msg:'Error selling item, check ownership'
				});
			}
		});
	}
})

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;