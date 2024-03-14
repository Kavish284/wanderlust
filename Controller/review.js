const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.CreateReview = async (req, res) => {
    
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log(newReview)
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        console.log("new review saved");
        req.flash("success","New Review Created!");
        
        res.redirect(`/listings/${req.params.id}`);
  // Corrected redirect route
    
};



module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // Update the listing to remove the reference to the review
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};