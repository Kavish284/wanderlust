const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");  
const Listing = require("../models/listing");
const { isLoggedIn, isowner, validateListing } = require("../middleware.js");
const ListingController = require("../Controller/listings");
const multer  = require('multer');
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage })

// Index Route
router.get("/", wrapAsync(ListingController.index));

// New route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// Show route
router.get("/:id", ListingController.showListing);

// Create Route
router.post("/", upload.single('listing[image]'), (req, res, next) => {
    // Here you can access req.file because it's within the middleware
    console.log(req.file);
    // Pass control to the next middleware or route handler
    next();
}, validateListing, wrapAsync(ListingController.createListing));


// Edit Route
router.get("/:id/edit", isLoggedIn, isowner, wrapAsync(ListingController.renderEditForm));

// Update Route
router.put('/:id', isLoggedIn, isowner, upload.single('listing[image]'),validateListing, wrapAsync(ListingController.UpdateLisitng));

// Delete Route
router.delete("/:id", isLoggedIn, isowner, wrapAsync(ListingController.deleteListing));


router.get('/category/:category', ListingController.filterByCategory);

module.exports = router;
