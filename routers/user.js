const express = require("express");
const router = express.Router();
const {allUsers,userById,getUser,updateUser,
    deleteUser,hasAuthorization,userPhoto,
     addFollower,addFollowing,removeFollower,removeFollowing
    ,findPeople} = require("../controllers/user");
const {requireSignin} = require("../controllers/auth");
const {updateValidators} =  require("../validators/validator");


router.put("/user/follow",requireSignin,addFollowing,addFollower);
router.put("/user/unfollow",requireSignin,removeFollowing,removeFollower)
router.get("/users",allUsers);
router.get("/user/:userId",requireSignin,getUser);
router.put("/user/:userId",requireSignin,hasAuthorization,updateValidators,updateUser);
router.delete("/user/:userId",requireSignin,hasAuthorization,deleteUser);
//photo router
router.get("/user/photo/:userId",userPhoto);
// who to follow
router.get("/user/people/:userId",requireSignin,findPeople);
// any route if parameter with userId then our app will first execute userById method as it is passed through param
router.param("userId",userById);
module.exports = router;