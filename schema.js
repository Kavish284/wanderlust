const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow('', null) // Allow an empty string or null for the image
}).required();

module.exports.reservationSchema = Joi.object({
    username: Joi.string().required(), // Username of the user making the reservation
    checkInDate: Joi.date().iso().required(),
    checkOutDate: Joi.date().iso().required(),
    guests: Joi.number().integer().min(1).required(),
    // You can add more fields here as needed
}).required();

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});
