var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require('../models/user');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var middleware=require("../middleware");
var Book=require("../models/book");
router.get('/',function(req,res){
	res.render("landing");
});

router.get("/register",function(req,res){
	res.render("register");
});
router.post('/register',function(req,res){
	console.log(req.body);
	var newUser=new User(
		{username:req.body.username,
		name:req.body.name,
		
		 email:req.body.email,
		 account:req.body.avatar,
		 gender:req.body.gender,
		 address:req.body.address,
		 number:req.body.number
		 
		});

	User.register(newUser,req.body.password,function(err,user){
		if(err){
			
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
		
			res.redirect("/");
		});
		
	});
	
});
router.get('/login',function(req,res){
	res.render("login",{page: 'register'});
});

router.post('/login',passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}),function(req,res){
	
});

router.get('/logout',function(req,res){
	req.logout();
	
	res.redirect("/");
});

router.get('/about',function(req,res){
	res.render("about");
});
router.get('/service',function(req,res){
	res.render("service");
});
router.get('/book',middleware.isLoggedIn,function(req,res){
	res.render("book");
});
router.post('/',middleware.isLoggedIn,function(req,res){
	 
  
  // add author to campground
  req.body.book.author = {
    id: req.user._id,
    username: req.user.username
  }
  Book.create(req.body.book, function(err, campground) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/users/'+req.user._id);
  
  });



	
});

router.get("/users/:id",middleware.isLoggedIn,function(req,res){
	User.findById(req.params.id,function(err,foundUser){
		if(err){
			req.flash("error","Something went wrong");
			res.redirect("/");
		}
	
		Book.find().where('author.id').equals(foundUser._id).exec(function(err,books){
			if(err){
				req.flash("error","Something went wrong");
				res.redirect("/");
			}
				res.render("user",{user:foundUser,books:books});
		});
		
	});
	
});

router.delete("/users/:id",middleware.isLoggedIn, function(req, res){
   Book.findByIdAndRemove(req.params.id, function(err){
      if(err){
		   req.flash('error', err.message);
          res.redirect("back");
      } else {
          res.redirect('/users/'+req.user._id);
      }
   });
});

module.exports=router;