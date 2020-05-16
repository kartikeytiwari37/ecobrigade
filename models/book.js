var mongoose=require("mongoose");

var bookSchema=new mongoose.Schema({
	name:String,
	 email:  String,
	number:String,
	address:String,
	 message: String,
	
	date: Date,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
		
	},

});
module.exports=mongoose.model("Book",bookSchema);