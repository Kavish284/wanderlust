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
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
