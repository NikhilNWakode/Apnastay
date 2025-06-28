const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary/index.js"); // your cloudinary config
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateListing, validateReview } = require('../schema.js');
const {isLoggedIn, isListingOwner} = require("../middleware.js");



// Render the listings page
router.get("/", wrapAsync(listingController.index))
// Render the new listing form
router.get("/new",isLoggedIn,listingController.renderNewForm );
// Handle the new listing form submission
router.post(
  "/",
  validateListing,
  upload.single("image"),
  isLoggedIn, // Validate the request body using the schema
  wrapAsync(listingController.createListing)
);

//Render the listing details page
router.get("/:id", wrapAsync(listingController.showListing));

//Edit listing route
router.get("/:id/edit",isLoggedIn,isListingOwner, wrapAsync(listingController.renderEditForm));

//Update a listing
router.put(
  "/:id",
  isLoggedIn,
  isListingOwner,
  upload.single("image"),
  wrapAsync(listingController.updateListing)
);


// Handle the deletion of a listing
// This route will delete a listing by its ID
router.delete(
  "/:id",
  isLoggedIn,
  isListingOwner, // 🛡️ Ownership check middleware
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
