const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/expresserror.js");
const { ListingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You are not Logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveredirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listing/${id}/show`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "Only Author can delete the Review");
    res.redirect(`/listing/${id}/show`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((e) => e.message).join(",");
    return next(new ExpressError(400, errmsg));
  } else {
    next();
  }
};

module.exports.validateListing = (req, res, next) => {
  const { error } = ListingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errmsg); // 400 for bad request
  } else {
    next();
  }
};
