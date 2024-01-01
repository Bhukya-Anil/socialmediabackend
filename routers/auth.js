const express = require("express");
const {signin,signout,forgotPassword,resetPassword,
    signupinit, signupCompletion} = require("../controllers/auth");
const {signUpValidator,signInValidator,resetPasswordValidator} = require("../validators/validator");
const {userById} = require("../controllers/user");
const router = express.Router();


router.post("/signup-firststep",signupinit);
router.post("/signup-completionstep",signUpValidator,signupCompletion)
// router.post("/signup",signUpValidator,signup);
// router.post("/social-login",sociallogin);
router.post("/signin",signInValidator,signin);
router.get("/signout",signout);
// forgot password reset link
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", resetPasswordValidator, resetPassword);
// any route if parameter with userId then our app will first execute userById method as it is passed through param
router.param("userId",userById);

module.exports = router;