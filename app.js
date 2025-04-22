if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//ejs
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views/"));

const methodOverride = require("method-override");
// const User = require("../models/user.js");
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));
app.use(express.static(path.join(__dirname,"/public/assets")));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

//ejs-mate
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const bookswapRouter = require("./routes/bookswap.js");

const userRouter = require("./routes/user.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/bookswap"; //1.M
// const dbUrl = process.env.ATLASDB_URL;//1.C

main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=> console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
} //2.M
// async function main(){
//     await mongoose.connect(dbUrl);
// }//2.C
// const store = MongoStore.create({
//     mongoUrl : dbUrl,
//     crypto : {
//         secret : process.env.SECRET,
//     },
//     touchAfter:24*3600,
// });

// store.on("error",()=>{
//     console.log("ERROR in MONGOSESSION STORE",err);
// });
const sessionOption = {
    //store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly :true,
    }
}
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/bookswap",bookswapRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong"} = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});