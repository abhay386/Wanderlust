const express = require("express");
const router = express.Router({ mergeParams: true });
const warpAsync = require("../utils/WrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { reviewSchema } = require("../schema.js");
// const Review = require("../models/review.js");
// const Listing = require("../models/listings.js");
const {validateReviews,isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/review.js");



// const validateReviews = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg)
//   } else {
//     next();
//   }
// }

// Reviews
// post  review route;
// /listings/:id/reviews
router.post("/",isLoggedIn, validateReviews, warpAsync(reviewController.createReview))

// Delete review route ;
// /listings/:id/reviews/:reviewId
// as we have to elimanate the common part of the url while using the router so this was the common part in both the urls 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, warpAsync(reviewController.destroyReview))

module.exports = router;