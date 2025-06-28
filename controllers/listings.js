const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { listings: allListings });
}

module.exports.renderNewForm = (req, res) => {
   
    res.render("listings/new");
}

module.exports.createListing = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ExpressError("Request body is missing", 400);
  }

  const { title, description, price, location, country } = req.body;

  // Check for uploaded image
  if (!req.file) {
    throw new ExpressError("Image file is required", 400);
  }

  const newListing = new Listing({
    title,
    description,
    price,
    image: {
      url: req.file.path,
      filename: req.file.filename,
    },
    location,
    country,
    owner: req.user._id,
  });

  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


  module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("owner");

  if (!listing) {
    req.flash("failure", "Listing does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
}

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return res.status(404).send("Listing not found");
    }
    res.render("listings/edit", {listing: listing});
}

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country } = req.body;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Update basic fields
  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.location = location;
  listing.country = country;

  // Handle image replacement if new image uploaded
  if (req.file) {
    // Optionally delete old image from Cloudinary
    const { cloudinary } = require("../cloudinary");
    if (listing.image?.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    // Save new image data
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${listing._id}`);
};


  module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    
    if (!deletedListing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }