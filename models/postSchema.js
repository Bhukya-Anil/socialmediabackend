const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const postSchema = new mongoose.Schema({
          title:{
            type:String,
            required:true,
            minlength:1,
            maxlength:100
          },
          body : {
            type:String,
            required:true,
            minlength:1,
            maxlength:200
          },
          photo :{
            data:Buffer,
            contentType:String
          },
          postedBy:{
            type: ObjectId,
            ref:"User"
          },
          created : {
                type: Date,
                default : Date.now
          },
          likes :[{type:ObjectId,ref:"User"}],
          comments:[{
            text:String,
            created:{type:Date,default:Date.now},
            postedBy:{type:ObjectId,ref:"User"}
          }]
         
        

});
module.exports = mongoose.model("Post",postSchema);