const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} =require("../middleware.js");
const bookswapController = require("../controllers/bookswap.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })
// const upload = multer({ dest: 'uploads/' })
router
    .route("/")
    .get(wrapAsync(bookswapController.index))
    .post(isLoggedIn, upload.any(),wrapAsync(bookswapController.createListing));

//New Route
router.get("/buy",isLoggedIn,bookswapController.renderBuyForm)
router.get("/new",isLoggedIn,bookswapController.renderNewForm);
//high probability of error bcz of new route

router.post("/buy",isLoggedIn,wrapAsync(bookswapController.checkAvailability));


router
    .route("/:id")
    .get(wrapAsync(bookswapController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(bookswapController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(bookswapController.destroyListing));

// Show Route
router.get("/:id",wrapAsync(bookswapController.showListing));


module.exports = router;