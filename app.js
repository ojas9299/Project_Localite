//DEPENDENCIES

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expresserror.js");
const { ListingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

//SETUP WORKFLOW ENVIRNMENT

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// SETUP DATABASE

main()
  .then(() => {
    console.log("Connection Sucessfull✈️");
  })
  .catch((e) => {
    console.log(e);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}
// ======*****SETUP COMPLETE*****======

const validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};

const validateReviews = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((e) => e.message).join(",");
    throw next(new ExpressError(errmsg, 400));
  } else {
    next();
  }
};

//all listings
app.get(
  "/listing",
  wrapAsync(async (req, res) => {
    let listings = await listing.find();
    res.render("./Listings/listings", { listings });
  })
);

//NEW ROUTE
app.get("/listing/new", (req, res) => {
  res.render("./listings/new.ejs");
});

app.post(
  "/listing",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newlisting = new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");
  })
);

//edit route
app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let Listing = await listing.findById(id);
    res.render("./listings/edit.ejs", { Listing });
  })
);

//update route
app.put(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(404, "enter valid data for Listing");
    }

    let id = req.params.id;
    await listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true, new: true }
    );
    res.redirect("/listing");
  })
);

//show route
app.get(
  "/listing/:id/show",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let newlisting = await listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { newlisting });
  })
);

app.get("/", (req, res) => {
  res.send("working fine");
});

//DELETE ROUTE
app.get(
  "/listing/:id/delete",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
  })
);

// review post route
app.post(
  "/listings/:id/reviews",
  validateReviews,
  wrapAsync(async (req, res, next) => {
    const Listing = await listing.findById(req.params.id);
    if (!Listing) {
      throw new ExpressError("Listing not found", 404);
    }
    const { review } = req.body;
    const newReview = new Review(review);
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    res.redirect(`/listing/${Listing._id}/show`);
  })
);

//DELETE review route
app.delete(
  "/listing/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}/show`);
  })
);

//Error Handling Queries
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

//Error Handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  // res.status(statusCode).send(message);
  res.render("./listings/error.ejs", { message });
});

app.listen("3000", () => {
  console.log("listening on port 3000🚀🎉");
});
