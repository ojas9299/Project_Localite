const joi = require("joi");

const ListingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.string().allow("", null),
      location: joi.string().required(),
      country: joi.string().required(),
    })
    .required(),
});

const reviewSchema = joi.object({
  review: joi
    .object({
      comment: joi.string().required(),
      rating: joi.number().required(),
    })
    .required(),
});
module.exports = { ListingSchema, reviewSchema };
