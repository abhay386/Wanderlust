const Listing = require("../models/listings.js");
const Review = require("../models/review.js");


/*
MERGE PARAMS IN EXPRESS ROUTING
-----------------------------
mergeParams: true allows us to access parameters from parent router
When you use nested routes (like /listings/:id/reviews), 
the child router (reviews) needs mergeParams to access the :id parameter

Example flow:
1. Parent route: /listings/:id
2. Child route: /reviews
3. Without mergeParams: req.params.id is undefined in reviews router
4. With mergeParams: req.params.id is accessible in reviews router
*/

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New review created !");

  console.log("new review saved")
  res.redirect(`/listings/${id}`)
}

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  //   This pull operator is the mongoose operator which pulls the value of the array which matches with the codition;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " Review Deleted !");
  res.redirect(`/listings/${id}`)
}