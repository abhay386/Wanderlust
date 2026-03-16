const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("../models/review.js");

const defaultImageUrl =
  "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
   url:{
    type:String,
    default:defaultImageUrl,
   },
   filename:{
    type:String, 
    default:"Default-image"
   },
  },

  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },

  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});

// To delete the reviews after deleting the listing;
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
    console.log("Reviews deleted successfully");
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;