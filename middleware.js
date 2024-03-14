const express = require("express");
const router = express.Router();
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const Listing = require("./models/listing");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isowner = async (req, res, next) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!req.user || !listing.owner._id.equals(req.user._id)) {
            req.flash("error", "You are not the Owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (error) {
        console.error("Error checking ownership:", error);
        req.flash("error", "Failed to check ownership.");
        res.redirect("/listings"); // Redirect to a safe location
    }
};

module.exports.validateListing = (req, res, next) => {
    try {
        let { error } = listingSchema.validate(req.body.listing || {});
        if (error) {
            let errmsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errmsg);
        } else {
            next();
        }
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
};

module.exports.validateReview = (req, res, next) => {
    try {
        let { error } = reviewSchema.validate(req.body);
        if (error) {
            let errmsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errmsg);
        } else {
            next();
        }
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
};



module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    try {
        const review = await Review.findById(reviewId);
        if (!review.author.equals(res.locals.curruser._id)) {
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (error) {
        console.error("Error checking ownership:", error);
        req.flash("error", "Failed to check ownership.");
        res.redirect("/listings"); // Redirect to a safe location
    }
};