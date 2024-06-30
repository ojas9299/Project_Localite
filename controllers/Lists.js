const Listing = require("../models/listing.js");

//all Listings
module.exports.All = async (req, res) => {
  const listings = await Listing.find();
  res.render("./listings/listings.ejs", { listings });
};

//NEW GET ROUTE
module.exports.NewgetRoute = (req, res) => {
  res.render("./listings/new.ejs");
};

//NEW POST ROUTE
module.exports.NewPostRoute = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "new Listing Created!");
  res.redirect("/listing");
};

//EDIT ROUTE
module.exports.GetEditRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("err", "Listing does not exists");
    res.redirect("/listing");
  }
  res.render("./listings/edit.ejs", { listing });
};

//UPDATE ROUTE
module.exports.PatchRoute = async (req, res) => {
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
};

//SHOW ROUTE
module.exports.ShowRoute = async (req, res) => {
  const { id } = req.params;
  const newlisting = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!newlisting) {
    req.flash("err", "Listing does not exists");
    res.redirect("/listing");
  }
  res.render("./listings/show.ejs", { newlisting });
};

//DELETE ROUTE
module.exports.DeleteRoute = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("sucess", "Listing Sucessfully deleted!");
  res.redirect("/listing");
};
