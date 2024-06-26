// DEPENDENCIES

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expresserror.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

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

// Use the listings routes
app.use("/listing", listings);
app.use("/listings/:id/reviews", reviews);

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
