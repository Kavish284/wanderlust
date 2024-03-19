const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 // Assuming Review model is defined in Review.js
//const User = require("./user.js"); // Assuming User model is defined in user.js


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image:{
        filename:  String,
        url: String,
        
    },
    price: Number,
    location: String,
    country: String,
    category: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reservations: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reservation"
        }
    ]
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
