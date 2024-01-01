const User = require("../models/userSchema");
const _ = require("lodash");
const fs = require("fs");
const formidable = require("formidable");
exports.userById = (req,res,next,id) =>{
          
         User.findById( id)
         .populate("following","_id name")
         .populate("followers","_id name")
         .then((user,err)=>{
            if(err || !user){
                return res.status(400).json({error:"User not found"});
            }
          //  console.log(user);
            req.profile = user // add profile object to req 
            next();

        })


};
exports.hasAuthorization = (req,res,next) =>{
           
       const authorization = req.profile && req.auth && (req.profile._id == req.auth._id);
       if(!authorization){
        return res.status(403).json({error:"User is not authorized to perform this action"});
       }
       next();

};
exports.allUsers = (req,res) =>{

           User.find().then((users,err)=>{
                  if(err ){
                    return res.status(400).json({error:err});
                  }
                const ux = users.map((user)=>{return {_id:user._id,name:user.name,email:user.email,created:user.created,updated:user.updated}});
                  res.json({users:ux});
           });
    

};
exports.getUser = (req,res) =>{
  
         req.profile.hashed_password=undefined;
         req.profile.salt=undefined;
       
        return res.json(req.profile);
       

};
// exports.updateUser = (req,res,next) =>{
          
//             let user = req.profile;
          
//             user = _.extend(user,req.body);
//              console.log(req.body);
           
//             if(req.body.email !== undefined){

//               User.find({email:req.body.email}).then((user)=>{
             
//                 if(user[0].email !== req.body.email){
//                   return res.status(400).json({error:"User email already exists"});
//                 }
//                 let userx = req.profile;
           
//                 userx = _.extend(userx,req.body);
//                 userx.updated = Date.now();
               
//                 userx.save().then((user,err)=>{
                 
//                   if(err){
//                     return res.status(400).json({error:"You are not authorized to perform this action"});
//                   }
//                   user.hashed_password=undefined;
//                   user.salt = undefined;
//                   res.json(user); 
//                 })
//               })
//               .catch((err)=>{
//                 return res.status(400).json({error:"You are not authorized to perform this action"});
//               })
//             }
//             else{
//             user.updated = Date.now();
//             user.save().then((user,err)=>{
//               if(err){
//                 return res.status(400).json({error:"You are not authorized to perform this action"});
//               }
//               user.hashed_password=undefined;
//               user.salt = undefined;
//              res.json({user});
              
//             })
//           }

// };
exports.updateUser = (req,res,next) =>{
        
          let form = new formidable.IncomingForm();
          form.keepExtensions = true;
          form.parse(req,(err,fields,files)=>{
                if(err){
                  return res.status(400).json({error:"Photo cannot be uploaded"});
                }
                let user = req.profile;
              
                user = _.extend(user,fields);
               
                
                user.updated = Date.now();
                if(files.photo){
                  user.photo.data = fs.readFileSync(files.photo.filepath);
                  user.photo.contentType = files.photo.mimetype;
                }
                user.save()
                .then((user)=>{
                  user.hashed_password=undefined;
                  user.salt = undefined;
                  return res.json(user);
                })
                .catch((err)=>{
                  console.log(err);
                  return res.status(400).json({error:err});
                })
          })


}
exports.deleteUser = (req,res) =>{

         const user = req.profile;
         user.remove().then((user,err)=>{

                if(err){
                  return res.status(401).json({error:err});
                }

                    res.json({message:"User deleted successfully"});
         })


}
exports.userPhoto = (req,res,next) =>{
    if(req.profile.photo.data){
     res.set("Content-Type",req.profile.photo.contentType); 
     return res.send(req.profile.photo.data);
    }
    next();



  }
  exports.addFollowing = (req,res,next) =>{
   
           User.findByIdAndUpdate(req.body.userId,{$push:{following:req.body.followId}})
          .then((result)=>{
            next();
          })
           .catch((err)=>{
            return res.status(400).json({error:err});
           })
           

       


  }
  exports.addFollower = (req,res) =>{
       User.findByIdAndUpdate(req.body.followId,{$push:{followers:req.body.userId}},{new:true})
       .populate("following","_id name")
       .populate("followers","_id name")
       .then((result)=>{
        result.hashed_password=undefined;
        result.salt = undefined;
              return res.json(result);
       })
       .catch((err)=>{
        res.status(400).json({error:err});
       })
       
  }
  exports.removeFollowing = (req,res,next)=>{
            User.findByIdAndUpdate(req.body.userId,
              {$pull:{following:req.body.followId}})
              .then((result)=>{
                next();
              })
              .catch((err)=>{
                return res.status(400).json({error:err});
              })

  }
  exports.removeFollower = (req,res) =>{
    User.findByIdAndUpdate(req.body.followId,{$pull:{followers:req.body.userId}},{new:true})
    .populate("followers","_id name")
    .populate("following","_id name")
    .then((result)=>{
      result.hashed_password = undefined;
      result.salt = undefined;
      return res.json(result);
    })
    .catch((err)=>{
      return res.status(400).json({error:err});
    })




  }
  exports.findPeople = (req,res)=>{
          // let followers = req.profile.followers;
           let following = req.profile.following;
           following.push(req.profile._id);
           User.find({_id:{$nin :following}})
           .select("_id name")
           .then((result)=>{
                res.json(result);
           })
           .catch((err)=>{
            return res.status(400).json({error:err});
           })


  }