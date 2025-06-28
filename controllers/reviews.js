const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
 // Optional but good: Double-check presence of req.body.review
    if (!req.body.review) {
      throw new ExpressError("Review data missing!", 400);
    }
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError("Listing not found!", 404);
    }
    const { rating, comment } = req.body.review;

    const newReview = new Review({ rating, comment });
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);
    

    await Promise.all([newReview.save(), listing.save()]);
    req.flash("success","New Review Created!");


    res.redirect(`/listings/${id}`);
  }


  module.exports.deleteReview = async (req, res) =>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");

    res.redirect(`/listings/${id}`);
}