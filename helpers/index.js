const nodeMailer = require("nodemailer");
const _ = require("lodash");



exports.sendEmail = (emailData) =>{
    const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth:{
        user:"mernstack8642@gmail.com",
        pass:"gexrxpzxkdyeoqdo"
    }
});
    return  transporter.sendMail(emailData)
    .then((resp)=>{
       
        return resp;
    })
    .catch((err)=>{
        console.log(err+"HELLO");
        return {err};
    })
   
        
  
   
    
  
   
}
