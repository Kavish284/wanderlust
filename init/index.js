const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Reservation = require("../models/reservation.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");

        await initDB();
    } catch (err) {
        console.error("Error initializing database:", err);
    }
}

async function initDB() {
    try {
        // Delete all documents from the Listing collection
        await Listing.deleteMany({});

        // Delete all documents from the Reservation collection
        await Reservation.deleteMany({});

        // Insert data into the Listing collection
        initData.data = initData.data.map((obj) => ({ ...obj, owner: "65b9694c37686c5ca91192d0" }));
        await Listing.insertMany(initData.data);

        console.log("Data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
}

main();
