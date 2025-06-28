const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review"); 

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
      default: "listing",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1692133216537-b4584e14fb7c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bGlzdGluZ3xlbnwwfHwwfHx8MA%3D%3D",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1692133216537-b4584e14fb7c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bGlzdGluZ3xlbnwwfHwwfHx8MA%3D%3D"
          : v,
    },
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner : {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});


listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
