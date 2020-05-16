var express=require("express");
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var Book=require("./models/book");
var passport=require("passport"),
	LocalStrategy=require("passport-local"),
	passportLocalMongoose=require("passport-local-mongoose"),
	methodOverride=require("method-override"),
	User=require("./models/user"),
	flash=require("connect-flash");

var indexRoutes=require("./routes/index");

mongoose.connect('mongodb+srv://blog:blog@cluster0-ovof1.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});



app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require('express-session')({
	secret:"KArtikey",
	resave:false,
	saveUninitialized:false
}));
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
   next();
});

app.use("/",indexRoutes);
var port = process.env.PORT || 3000;
app.listen(port, function() { 
  console.log('Server listening on port 4000'); 
});