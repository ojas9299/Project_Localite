const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ReviewControllers = require("../controllers/review.js");

const { isLoggedIn, isAuthor, validateReview } = require("../middleware.js");

// Review post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(ReviewControllers.ReviewPostRoute)
);

// Delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(ReviewControllers.ReviewDelete)
);

module.exports = router;
