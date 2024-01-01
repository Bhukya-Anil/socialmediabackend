const User = require("../models/userSchema");
const SignUp = require("../models/signupSchema");
const crypto = require("crypto");
const { expressjwt: expressJwt } = require('express-jwt');
const _ = require("lodash");
const {sendEmail} = require("../helpers")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
exports.signupinit =  (req,res)=>{
      req.body.signUpLink="";
       User.findOne({email:req.body.email})
       .then((userExists)=>{
        if(userExists){
          return res.status(400).json({error:"An Account on this email already exists"});
        }
        else{
          SignUp.findOne({email:req.body.email}).
          then(async (user1)=>{
           if(user1){ await user1.delete();}
           const ux = await new SignUp({email:req.body.email});
           const token = jwt.sign({_id:ux._id,iss:"NODEAPI"},process.env.JWT_SECRET);
           ux.signUpLink = token;
           ux.save().then((resp)=>{
            const emailData = {
              from :"noreply@node-react.com",
               to:req.body.email,
                subject:"Sign Up Instructions",
                text:`Please use the link to create an account  : ${process.env.CLIENT_URL}/signup-completionstep/${token}`,
                html: `<p>Please use the following link to create your account:</p> <p>${
               process.env.CLIENT_URL
               }/signup-completionstep/${token}</p>`
                 
                      }
              sendEmail(emailData)
              .then((rsp)=>{
                return res.json({message:"Verficication link has been sent to you email"});
              })
              .catch((err)=>{
                return res.status(400).json({error:err});
              })

           })
           .catch((err)=>{return res.status(400).json({error:err});})
           
          });
        }
       })
}
exports.signupCompletion =  (req,res)=>{
          if(req.body.signUpLink===""){  return res.status(400).json({error:"Invalid Link"});}
         SignUp.findOne({signUpLink:req.body.signUpLink}).then((user)=>{
        
         if(!user ){
                return res.status(400).json({error:"Invalid Link"});
         }
         req.body.email  =  user.email;
         const userx = new User(req.body);   
         userx.save().then((ux)=>{
          user.delete().then((resp)=>{ return  res.status(200).json({message:"Sign up Successful"});})
          .catch((err)=>{return res.status(400).json({error:err});})
         })
         .catch((err)=>{
          return res.status(400).json({error:err});
         })
       
        

        })
        
        
           


 }
// exports.sociallogin = (req,res)=>{
     
//    User.findOne({email:req.body.email})
//   .then((user)=>{
//        if(!user){
//         user = new User(req.body);
//             req.profile = user;
//             user.save();
//             // generate a token with user id and secret
//             const token = jwt.sign(
//                 { _id: user._id, iss: "NODEAPI" },
//                 process.env.JWT_SECRET
//             );
//             res.cookie("t", token, { expire: new Date() + 9999 });
//             // return response with user and token to frontend client
//             const { _id, name, email } = user;
//             return res.json({ token, user: { _id, name, email } });
//        }
//        else {
//         // update existing user with new social info and login
//         req.profile = user;
//         user = _.extend(user, req.body);
//         user.updated = Date.now();
//         user.save();
//         // generate a token with user id and secret
//         const token = jwt.sign(
//             { _id: user._id, iss: "NODEAPI" },
//             process.env.JWT_SECRET
//         );
//         res.cookie("t", token, { expire: new Date() + 9999 });
//         // return response with user and token to frontend client
//         const { _id, name, email } = user;
//         return res.json({ token, user: { _id, name, email } });
//     }
//   })
 

// }
exports.signup = async (req,res)=>{
          const userExists = await User.findOne({email:req.body.email});
          if(!userExists){
             const user = await new User(req.body);     
           await user.save();
           res.status(200).json({message:"Sign up Successful"});
           
          }
          else{
            return res.status(403).json({message:"Email is already taken"});
          }
          


};
exports.signin =  (req,res)=>{
        User.findOne({email:req.body.email})
        .then((user,err)=>{
                  if(!user || err){
                   
                    return res.status(401).json({error:"User with that email does not exists. Please Sign Up"});
                  }
                  if(!user.authenticate(req.body.password)){
                    return res.status(401).json({error:"Incorrect password"});
                  }
                 // create a jwt token
                  const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
                  // create a cookie using above token
                  res.cookie("t",{expires: new Date() + 99999});
                  // return response with  user and jwt token  to client
                  const {_id,name,email} = user;
                  return res.json({token,user:{_id,name,email}});

        })
};
exports.signout = (req,res) =>{

      res.clearCookie("t");
      return res.json({message:"Sign out sucessful"});

}
exports.requireSignin = expressJwt({
  // if jwt token is valid then expressJwt will append the id of verified users in a auth key to the request object
            secret: process.env.JWT_SECRET,
            algorithms:["HS256"],
            userProperty: "auth"
          
});
exports.forgotPassword = (req,res) =>{

  User.find({email:req.body.email})
  .then((users)=>{
    if(users.length==0){return res.status(400).json({error:"No account with that email exists"})}
    const user = users[0];
     const token = jwt.sign(
     { _id:user._id,iss:"NODEAPI"},
     process.env.JWT_SECRET
     );
     const emailData = {
      from :"noreply@node-react.com",
      to:req.body.email,
      subject:"Password Reset Instructions",
      text:`Please use the link to reset password : ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${
        process.env.CLIENT_URL
    }/reset-password/${token}</p>`

     }
     
     return user.updateOne({resetPasswordLink:token})
     .then((respx)=>{

     sendEmail(emailData);
     return res.json({message:"Email will be sent to you registered email in a minute"});

    

     })
     .catch((err)=>{
      
      return res.status(400).json(err);
     })



  })

    

}
exports.resetPassword = (req,res) =>{

  const {resetPasswordLink,newPassword} = req.body;
  User.findOne({resetPasswordLink})
  .then((user)=>{
       if(!user){
        res.status(400).json({error:"Invalid Link!"});
       }
      
       const updatedFields = {
        password:newPassword,
        resetPasswordLink:""
       }
       user = _.extend(user,updatedFields);
     
       user.save()
       .then((result)=>{
             res.json({message:"Password Changed! Login To Your Account"});
       })
       .catch((err)=>{
        return res.status(400).json({error:err});
       })

  })
  .catch((err)=>{
    return res.status(400).json({error:"Invalid Link!"});
  })

}


