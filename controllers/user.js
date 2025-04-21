const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup = async(req,res)=>{
    try{
        let {username ,password,email} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            res.redirect("/bookswap");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login = async(req,res)=>{
    let redirectUrl = res.locals.redirectUrl || "/bookswap";
    res.redirect(redirectUrl);
}
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/bookswap");
    });
}