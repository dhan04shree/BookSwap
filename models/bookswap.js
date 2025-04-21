const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookswapSchema = new Schema({
    fullname : {
       type : String,
        required : true,
    },
    description : String ,
    originalP : String ,
    decidedP : String ,
    image :{
        url : String,
        filename : String,
    },
    contact:{
        type: String,
        required:true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    owner :{
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    branch : {
        type : String,
        required : true,
        enum :["aids","comp","it","entc","mech","elec"]
    },
    sem : {
        type : String,
        required : true,
        enum :["sem1","sem2","sem3","sem4","sem5","sem6","sem7","sem8"]
    },
});


const Bookswap = mongoose.model("Bookswap",bookswapSchema);
module.exports = Bookswap;