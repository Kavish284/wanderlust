const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.error("Error connecting to DB:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errmsg)
    }else{
        next();
    }
}
// Index Route
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("Internal Server Error");
    }
});

// New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show route
app.get("/listings/:id", async (req, res) => {
    try {
        let { id } = req.params;
        const singleListing = await Listing.findById(id);
        res.render("listings/show.ejs", { listing: singleListing });
    } catch (err) {
        console.error("Error fetching listing details:", err);
        res.status(404).send("Listing Not Found");
    }
});

// Create Route

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;
        const singleListing = await Listing.findById(id);
        res.render("listings/edit.ejs", { singleListing });
    } catch (err) {
        console.error("Error fetching listing for editing:", err);
        res.status(404).send("Listing Not Found");
    }
});

// Update Route
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
   
      const { id } = req.params;
      const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
      res.redirect(`/listings/${updatedListing._id}`);
    
  }));
// Delete Route
app.delete("/listings/:id", async (req, res) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Internal Server Error");
    }
});
app.all("*",(req,res,next) => {
    next(new ExpressError(404,"page not found"));

});
app.use((err,req,res,next) => {
    let {statusCode, message} = err;
    res.status(statusCode).send(message);
});
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
