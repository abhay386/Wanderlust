const express = require("express");
const router = express.Router();
// const Listing = require("../models/listings.js");  // Move this up
const warpAsync = require("../utils/WrapAsync.js");

const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage  })



// Router => to group the common paths;
router.route("/")
.get( warpAsync(listingController.index))
.post( isLoggedIn, upload.single('Listing[image]'),validateListing, warpAsync(listingController.createListing));




// New route;
router.get("/new", isLoggedIn, listingController.renderNewForm)

// router Now for Id.

router.route("/:id")
.get( warpAsync(listingController.showListings))
.put( isLoggedIn,isOwner,upload.single('Listing[image]'), validateListing, warpAsync(listingController.updateListing))
.delete( isLoggedIn,isOwner, warpAsync(listingController.destoryListing));
// Index route
// router.get("/", warpAsync(listingController.index))



// Show ROUTE
// router.get("/:id", warpAsync(listingController.showListings))

// Create route;
// router.post("/", validateListing, warpAsync(listingController.createListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, warpAsync(listingController.renderEditForm))

// Update Route
// router.put("/:id", isLoggedIn,isOwner, validateListing, warpAsync(listingController.updateListing))

// Delete route;
// router.delete("/:id",isLoggedIn,warpAsync(async(req,res)=>{
//     let {id}= req.params;
//     let deletelisting = await Listing.findByIdAndDelete(id);
//     console.log(deletelisting);
//     req.flash("success", "Listing Deleted !");
//     res.redirect("/listings")
// }))

// Delete route;
// router.delete("/:id", isLoggedIn,isOwner, warpAsync(listingController.destoryListing));

module.exports = router