const Post = require("../models/postSchema");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash")
exports.updatePost = (req,res) =>{
   
   let form = new formidable.IncomingForm();
   form.keepExtensions = true;
   form.parse(req,(err,fields,files)=>{
   
   
    if(err){
        return res.status(400).json({error:err});
    }

           let post = req.post;
          
           post = _.extend(post,fields);
          
           
           if(files.photo){
            post.photo.data = fs.readFileSync(files.photo.filepath);
            post.photo.contentType = files.photo.mimetype;
           }
           post.updated = Date.now();
           post.save()
           .then((post)=>{
           
            return res.json(post);
           })
           .catch((err)=>{
            return res.status(400).json({error:err});
           })


   })
};
exports.deletePost = (req,res) =>{
    const post = req.post;
    post.remove().then((result,err)=>{
          if(err){
            return res.status(400).json({error:err});
          }
          res.json({result});
    });
}
exports.postById = (req,res,next,id) =>{
    Post.findById(id)
    .populate("postedBy","_id name")
    .populate("comments","text created ")
    .populate("comments.postedBy","_id name")
    .then((post)=>{
        req.post = post;
       next();
    }).catch((err)=>{return res.status(400).json({error:err});})     
};
exports.isPost = (req,res,next) =>{
    const isPost = req.post && req.auth && (req.auth._id == req.post.postedBy._id);
    if(!isPost){
        res.status(400).json({error:"You cannot delete post of other users"});
    }
    next();
}
exports.getPosts = (req,res) =>{
    const posts = Post.find()
    .populate("postedBy","_id name")
    .populate("comments","text created ")
    .populate("postedBy","_id name")
    .select("_id title body created likes")
    .sort({created:-1})
    .then((data)=>{
       res.status(200);
       res.json(data);
    })
    .catch((err)=>{console.log(err);})
};
exports.createPosts = (req,res) =>{
   
    var form = new formidable.IncomingForm();
   
    form.keepExtensions = true;
   
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({error:"Image could not be uploaded"});
        }
        let post = new Post(fields);
      
       req.profile.hashed_password = undefined;
       req.profile.salt  = undefined;
      
        post.postedBy = req.profile;
      
      
        if(files.photo){
            post.photo.data = fs.readFileSync(files.photo.filepath);
            post.photo.contentType = files.photo.mimetype;
        }
      
        post.save().then((result,err)=>{
            if(err){
                return res.status(400).json({error:err});
            }
            
            return res.json({result});
        })
    })
};
exports.postsByUser = (req,res) =>{ 
    Post.find({postedBy:req.profile._id})
    .select("_id title body created likes")
    .populate("postedBy","_id name")
    .sort("_created")
    .then((posts,err)=>{
         if(err){
           return res.status(400).json({error:err});
         }
         res.json(posts);
    })
}
exports.postPhoto = (req,res)=>{
    res.set("Content-Type",req.post.photo.contentType);
    return res.send(req.post.photo.data);

}
exports.singlePost = (req,res) =>{
       
    return res.json(req.post);

}
exports.like = (req,res) =>{
 
   Post.findByIdAndUpdate(req.body.postId,{$push:{likes:req.body.userId}},{new:true})
   .then((post)=>{
   
    return res.json(post);
   })
   .catch((err)=>{
   
    return res.status(400).json({error:err});
   })

}
exports.unlike = (req,res) =>{
    
    Post.findByIdAndUpdate(req.body.postId,{$pull:{likes:req.body.userId}},{new:true})
    .then((post)=>{
     return res.json(post);
    })
    .catch((err)=>{
     return res.status(400).json({error:err});
    })
 
 }

 exports.addComment = (req,res) =>{
      let comment = req.body.comment;
      comment.postedBy = req.body.userId;
    Post.findByIdAndUpdate(req.body.postId,{$push:{comments:comment}},{new:true})
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .then((post)=>{
        return res.json(post);
    })
    .catch((err)=>{
        return res.status(400).json({error:err});
    })
 }
 exports.unComment = (req,res) =>{
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;
  Post.findByIdAndUpdate(req.body.postId,{$pull:{comments:{_id:comment._id}}},{new:true})
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .then((post)=>{
      return res.json(post);
  })
  .catch((err)=>{
      return res.status(400).json({error:err});
  })
 
 }