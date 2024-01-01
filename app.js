const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 8080;
//db
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true})
.then(()=>{
    console.log("Connected to database");
})
.catch(()=>{
    console.log("Error in db connections");
});



//bring in routes
const postRouter = require("./routers/post");
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");

// middlewares
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());



// routes

app.use("/preload",postRouter);
app.use("/preload",authRouter);
app.use("/preload",userRouter);
app.use(function (err,req,res,next){
    if(err.name === "UnauthorizedError"){
          return res.status(401).json({error:"Unauthorized"});
    }
})

// server listening


// if ( process.env.NODE_ENV === "production"){

//     app.use(express.static("client/build"));

//     const path = require("path");

//     app.get("*", (req, res) => {

//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

//     })


// }
 



app.listen(port,()=>{
    console.log("Server started");
})