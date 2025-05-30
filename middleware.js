const Bookswap = require("./models/bookswap.js");
const ExpressError = require("./utils/ExpressError.js"); 
const {bookswapSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please log in to continue");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let bookswap = await Bookswap.findById(id);
    if(!bookswap.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/bookswap/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) =>{
    let {error} = bookswapSchema.validate(req.body);
  
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400,errMsg);
        } else {
            next();
        }
};