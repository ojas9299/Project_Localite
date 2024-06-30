const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresserror.js");
const { ListingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
  const { error } = ListingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errmsg); // 400 for bad request
  } else {
    next();
  }
};

// GET all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find();
    res.render("./listings/listings.ejs", { listings }); // Assuming the correct path for the listings view
  })
);

// NEW listing route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

// CREATE a new listing
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "new Listing Created!");
    res.redirect("/listing");
  })
);

// EDIT listing route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("err", "Listing does not exists");
      res.redirect("/listing");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);

// UPDATE listing route
router.put(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!req.body.listing) {
      throw new ExpressError(400, "Enter valid data for Listing");
    }
    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true, new: true }
    );
    req.flash("updated", "Listing Sucessfuly updated");
    res.redirect("/listing");
  })
);

// SHOW listing route
router.get(
  "/:id/show",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const newlisting = await Listing.findById(id).populate("reviews");
    if (!newlisting) {
      req.flash("err", "Listing does not exists");
      res.redirect("/listing");
    }
    res.render("./listings/show.ejs", { newlisting });
  })
);

// DELETE listing route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("sucess", "Listing Sucessfully deleted!");
    res.redirect("/listing");
  })
);

module.exports = router;
