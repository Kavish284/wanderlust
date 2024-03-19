// models/reservation.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    checkInDate: Date,
    checkOutDate: Date,
    guests: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }
});

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
