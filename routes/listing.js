const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresserror.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

const ListingControllers = require("../controllers/Lists.js");

router
  .route("/")
  // GET all listings
  .get(wrapAsync(ListingControllers.All))
  // CREATE a new listing
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
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

// NEW listing route
router.get("/new", isLoggedIn, ListingControllers.NewgetRoute);

router
  .route("/:id")
  // UPDATE listing route
  .put(
    isOwner,
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingControllers.PatchRoute)
  )
  // DELETE listing route
  .delete(isOwner, isLoggedIn, wrapAsync(ListingControllers.DeleteRoute));

// SHOW listing route
router.get("/:id/show", wrapAsync(ListingControllers.ShowRoute));

module.exports = router;
