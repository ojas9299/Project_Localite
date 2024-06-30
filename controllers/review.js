const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/expresserror.js");

//REVIEW POST ROUTE
module.exports.ReviewPostRoute = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  const { review } = req.body;
  const newReview = new Review(review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("reviewCreated", "New Review Created!");
  res.redirect(`/listing/${listing._id}/show`);
};

module.exports.ReviewDelete = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("reviewdeleted", "Review Deleted Sucessfully!");
  res.redirect(`/listing/${id}/show`);
};
