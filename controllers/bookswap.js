const Bookswap = require("../models/bookswap.js");
const ExpressError = require("../utils/ExpressError.js");
module.exports.index = async (req,res)=>{
    const allList = await Bookswap.find({});
    res.render("bookswap/index.ejs",{allList});
}
module.exports.renderBuyForm = (req,res)=>{
    res.render("bookswap/buy.ejs");
}
module.exports.renderNewForm = (req,res)=>{
    // console.log(req.user);
    res.render("bookswap/new.ejs");
}
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;  

    const listing = await Bookswap.findById(id).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/bookswap");
    }
    // console.log(listing);
    res.render("bookswap/show.ejs",{listing});
}
// module.exports.createListing = async(req,res)=>{
//     let {fullname,description,originalP,decidedP,branch,sem,contact} = req.body;
//     console.log("create",req.body.bookswap);
//     let url = req.file.path;
//     let filename = req.file.filename;
//     const newlisting = new Bookswap(req.body.bookswap);
//     newlisting.owner = req.user._id;

//     newlisting.image = {url,filename};
    
//     await newlisting.save();
//     if(!newlisting.description){
//         throw new ExpressError(400,"Description is missing");
//     }
//     req.flash("success","Book listed successfully!");
//     res.redirect("/bookswap");
// }
module.exports.createListing = async (req, res) => {
    const { fullname, contact, branch, sem } = req.body;
    const bookEntries = Object.entries(req.body.bookswap || {});
    const files = req.files;
  
    try {
      for (let i = 0; i < bookEntries.length; i++) {
        const [_, book] = bookEntries[i];
  
        // Find the corresponding image file
        const file = files.find(f => f.fieldname === `bookswap[${i}][image]`);
        const image = {
          url: file?.path || '',
          filename: file?.filename || ''
        };
  
        const newListing = new Bookswap({
          fullname,
          contact,
          branch,
          sem,
          description: book.description,
          originalP: book.originalP,
          decidedP: book.decidedP,
          image,
          owner: req.user._id
        });
  
        if (!newListing.description) {
          throw new ExpressError(400, `Description missing for book #${i + 1}`);
        }
  
        await newListing.save();
      }
  
      req.flash('success', 'Books listed successfully!');
      res.redirect('/bookswap');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to list books. Please try again.');
      res.redirect('/bookswap/new');
    }
  };
  
module.exports.checkAvailability = async(req,res)=>{
     let {branch,sem} = req.body.bookswap;
     
         const allListings = await Bookswap.find({$and : [{branch: branch},{sem:sem}]});
        // console.log(allListings);
          if(allListings.length == ""){
            throw new ExpressError(404,"The book you're looking for is not available currently");
            }else{
                res.render("bookswap/dashboard.ejs",{allListings});
            }
}