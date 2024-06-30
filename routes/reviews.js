const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresserror.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isAuthor,
  validateReview,
  reviewSchema,
} = require("../middleware.js");

// Review post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res, next) => {
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
  })
);

// Delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("reviewdeleted", "Review Deleted Sucessfully!");
    res.redirect(`/listing/${id}/show`);
  })
);

module.exports = router;
