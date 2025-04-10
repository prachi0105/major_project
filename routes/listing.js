const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
const listingcontroller = require("../controller/listings.js");
const multer = require('multer');

const {storage} = require("../cloudConfig.js");

const upload = multer({storage});


router.route("/")
.get( wrapAsync(listingcontroller.index ))
 .post(isLoggedIn, upload.single("listing[image]"),validateListing,wrapAsync( listingcontroller.createListing ));


//new routes
router.get("/new", isLoggedIn , listingcontroller.renderNewForm );


router.route("/:id")
.get(wrapAsync(  listingcontroller.showListings))
.put(isLoggedIn,isOwner, upload.single("listing[image]"),validateListing,wrapAsync( listingcontroller.updateListings))
.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.destroyListing ));






 //edit
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(  listingcontroller.renderEditForm));
   
  
   
 module.exports = router;  