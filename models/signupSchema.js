const mongoose = require("mongoose");

const SignUpSchema = new mongoose.Schema({
      
    email:{
        type:String,
        trim:true,
        required:true
    },
    signUpLink:{
        type:String,
        default:""
    }




});
module.exports = mongoose.model("SignUp",SignUpSchema);