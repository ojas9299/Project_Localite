const mongoose = require("mongoose");
const { Schema } = mongoose;
const reviewSchema = new Schema({
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
