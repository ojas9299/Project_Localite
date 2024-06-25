// DEPENDENCIES

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expresserror.js");
const { ListingSchema, reviewSchema } = require("./schema.js");

const listings = require("./routes/listing.js");

// SETUP WORKFLOW ENVIRONMENT

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// SETUP DATABASE

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
  console.log("Connection Successful✈️");
}

main().catch((e) => {
  console.log(e);
});

// ======*****SETUP COMPLETE*****======

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((e) => e.message).join(",");
    return next(new ExpressError(errmsg, 400));
  } else {
    next();
  }
};

// Use the listings routes
app.use("/listing", listings);

// Review post route
app.post(
  "/listing/:id/reviews",
  validateReview,
  wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError("Listing not found", 404);
    }
    const { review } = req.body;
    const newReview = new Review(review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}/show`);
  })
);

// Delete review route
app.delete(
  "/listing/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}/show`);
  })
);

// Error Handling Queries
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

// Error Handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});

// Start the server
app.listen(3000, () => {
  console.log("Listening on port 3000🚀🎉");
});
