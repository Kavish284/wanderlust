const Reservation = require('../models/reservation.js');
const Listing = require('../models/listing.js');
const nodemailer = require('nodemailer');




module.exports.createReservation = async (req, res, next) => {
    try {
        // Extract data from request body
        const { checkInDate, checkOutDate, guests } = req.body;
        const userId = req.user._id;
        const listingId = req.params.id;

        // Find listing by ID
        const listing = await Listing.findById(listingId);

        if (!listing) {
            // If listing not found, handle the error
            throw new Error('Listing not found');
        }

        // Create reservation object
        const reservation = new Reservation({
            checkInDate,
            checkOutDate,
            guests,
            user: userId,
            listing: listingId
        });

        // Save reservation to the database
        await reservation.save();
        
        // Add reservation to the listing's reservations array
        listing.reservations.push(reservation);

        // Save the updated listing
        await listing.save();

        // Respond with success message
        req.flash("success", "Reservation done successfully");
        res.redirect(`/listings/${req.params.id}`);
    } catch (err) {
        next(err); // Pass error to error handling middleware
    }
};

// controllers/reservationController.js

