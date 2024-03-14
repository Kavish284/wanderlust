const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    try {
        let { id } = req.params;
        const singleListing = await Listing.findById(id).populate({path:"reviews", populate:{
            path:"author",
        },
        }).populate("owner");
        if (!singleListing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }
        console.log("Single Listing with Reviews:", singleListing);
        res.render("listings/show.ejs", { listing: singleListing });
    } catch (err) {
        console.error("Error fetching listing details:", err);
        res.status(404).send("Listing Not Found");
    }
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename  = req.file.filename;
    console.log(url, "..", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    try {
        let { id } = req.params;
        const singleListing = await Listing.findById(id);
        if (!singleListing) {
            req.flash("error", "listing you requested for does not exist !");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { singleListing });
    } catch (err) {
        console.error("Error fetching listing for editing:", err);
        res.status(404).send("Listing Not Found");
    }
};

module.exports.UpdateLisitng = (async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    if (typeof req.file != "undefined"){
        let url = req.file.path;
        let filename  = req.file.filename;
        updatedListing.image = { url , filename};
        await updatedListing.save();

    }
    
    req.flash("success", "listing updated!");
    res.redirect(`/listings/${updatedListing._id}`);
});

module.exports.deleteListing = async (req, res) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        req.flash("error", "Failed to delete listing");
        res.redirect("/listings");
    }
};