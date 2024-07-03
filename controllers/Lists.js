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
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
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
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/h_300,w_250");
  res.render("./listings/edit.ejs", { listing, originalImage });
};

//UPDATE ROUTE
module.exports.PatchRoute = async (req, res) => {
  const { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(400, "Enter valid data for Listing");
  }
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, new: true }
  );
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("updated", "Listing Sucessfuly updated");
  res.redirect("/listing");
};

module.exports.SearchRoute = async (req, res) => {
  try {
    const search = req.body.searchValue;
    let listing = await Listing.findOne({
      $or: [{ country: search }, { location: search }],
    });

    if (!listing) {
      req.flash("error", "Expedition does not exist");
      return res.redirect("/listing");
    } else {
      let id = listing._id;
      return res.redirect(`/listing/${id}/show`);
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while searching for the expedition");
    res.redirect("/listing");
  }
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
