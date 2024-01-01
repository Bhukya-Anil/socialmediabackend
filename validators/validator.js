exports.validatePost = (req, res, next) => {
  //title  
  req.check("title", "Title should not be empty").notEmpty();
  req.check("title", "Title must have minimum length of 4 and maximum lenght of 25").isLength({
    min: 4,
    max: 25
  });
  // body
  req.check("body", "Title should not be empty").notEmpty();
  req.check("body", "Title must have minimum length of 4 and maximum lenght of 25").isLength({
    min: 5,
    max: 200
  });
  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors[0].msg;

    return res.status(400).json({ error: firstError });
  }
  next();

}
exports.signUpValidator = (req, res,next) => {

  

 

  req.check("password", "password Should not be empty").notEmpty();

  req.check("password")
    .isLength({
      min: 8,
      max: 14
    }).withMessage("Password must be between 8 to 14 characters")
    .matches(/\d/).withMessage("Password must contain a Number");

  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors[0].msg;

    return res.status(400).json({ error: firstError });
  }
  next();



}
exports.signInValidator = (req, res, next) => {

  // req.check("email", "Invalid Email")
  //   .matches(/.+\@.+\..+/).withMessage("Email must contain @symbol");

  req.check("password", "password Should not be empty").notEmpty();

  req.check("password")
    .isLength({
      min: 8,
      max: 14
    }).withMessage("Password must be between 8 to 14 characters")
   

  const errors = req.validationErrors();
   
  if (errors) {
    const firstError = errors[0].msg;

    return res.status(400).json({ error: firstError });
  }
 next();



}
exports.updateValidators = (req,res,next) =>{
  if(req.body !== undefined){
  if(req.body.name !== undefined){
    req.check("name", "Name is Required").notEmpty();
  }
  if(req.body.email !== undefined){
    req.check("email", "Invalid Email")
    .matches(/.+\@.+\..+/).withMessage("Email must contain @symbol");
  }
}
  const errors = req.validationErrors();
   
  if (errors) {
    const firstError = errors[0].msg;

    return res.status(400).json({ error: firstError });
  }
 next();
  
}
exports.resetPasswordValidator = (req,res,next) =>{

     req.check("newPassword","new password should not be empty").notEmpty();
     req.check("newPassword","new password should have atleast 8 characters and atmost 14 characters")
     .isLength({
      min:8,
      max:14
     });
     req.check("newPassword","new password should have a numerical digit")
     .matches(/\d/);
     const errors = req.validationErrors();
     if(errors){
      const firstError = errors[0].msg;
      return res.status(400).json({error:firstError});
     }
     next();


}