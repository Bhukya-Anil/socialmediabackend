const express = require("express");
const {getPosts,createPosts} = require("../controllers/post");
const {userById,hasAuthorization} = require("../controllers/user");
const {postsByUser,postById,isPost,deletePost,
    updatePost,postPhoto,singlePost,like,unlike,
        addComment,unComment} = require("../controllers/post");
const {requireSignin} = require("../controllers/auth");
const router = express.Router();

router.get("/",getPosts);
router.get("/posts/by/:userId",requireSignin,postsByUser);
router.get("/post/:postId",singlePost);
router.get("/post/photo/:postId",postPhoto);
router.post("/post/new/:userId",requireSignin,hasAuthorization,createPosts);
// like and unlike
router.put("/post/like",requireSignin,like);
router.put("/post/unlike",requireSignin,unlike);
//comment and delte comment
router.put("/post/comment",requireSignin,addComment);
router.put("/post/uncomment",requireSignin,unComment);
router.put("/post/:postId",requireSignin,isPost,updatePost);
router.delete("/post/:postId",requireSignin,isPost,deletePost);


router.param("userId",userById);
router.param("postId",postById);
module.exports = router;