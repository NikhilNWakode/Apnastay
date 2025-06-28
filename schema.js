const Joi = require("joi");
const ExpressError = require("./utils/ExpressError.js");

// Listing Schema
const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().uri().allow("").optional(),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

// Review Schema
const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

// Validators
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) throw new ExpressError(error.details[0].message, 400);
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) throw new ExpressError(error.details[0].message, 400);
  next();
};

// Export both
module.exports = {
  validateListing,
  validateReview,
};
