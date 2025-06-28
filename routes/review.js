const express =  require("express");
const router = express.Router({ mergeParams: true });

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateListing, validateReview } = require('../schema.js');
const {isLoggedIn,  isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



// Review creation route
router.post(
  "/",
  isLoggedIn,
  validateReview,
   // Joi schema validation
  wrapAsync(reviewController.createReview)
);

//Delete review route
router.delete("/:reviewId",
   isLoggedIn,
   isReviewAuthor,
   wrapAsync(reviewController.deleteReview)
); 

module.exports = router;