var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var UserSchema=new mongoose.Schema({
	username: {type:String,unique:true,required:true},
    password: String,
	account:String,
   address:String,
	gender:String,
	name:String,
  number:String,
    email:  {type:String,unique:true,required:true},
	resetPasswordToken: String,
    resetPasswordExpires: Date,
    
});
UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",UserSchema);