const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresserror.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const ListingControllers = require("../controllers/Lists.js");

// GET all listings
router.get("/", wrapAsync(ListingControllers.All));

// NEW listing route
router.get("/new", isLoggedIn, ListingControllers.NewgetRoute);

// CREATE a new listing
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(ListingControllers.NewPostRoute)
);

// EDIT listing route
router.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(ListingControllers.GetEditRoute)
);

// UPDATE listing route
router.put(
  "/:id",
  isOwner,
  isLoggedIn,
  wrapAsync(ListingControllers.PatchRoute)
);

// SHOW listing route
router.get("/:id/show", wrapAsync(ListingControllers.ShowRoute));

// DELETE listing route
router.delete(
  "/:id",
  isOwner,
  isLoggedIn,
  wrapAsync(ListingControllers.DeleteRoute)
);

module.exports = router;
