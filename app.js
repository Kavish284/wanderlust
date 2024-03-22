if (process.env.NODE_ENV!== "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const reservationRoutes = require('./routes/reservationRoutes.js');
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userrouter = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 
const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,

});
store.on("error",() => {
    console.log("ERROR IN MONGO SESSION STORE",err);
});
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.error("Error connecting to DB:", err);
});

async function main() {
    await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Updated to use User model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    console.log(res.locals.success);
    next();
});

app.get("/demouser", async (req, res) => {
    
    
        let fakeuser = new User({
            email: "student1@gmail.com",
            username: "delta-student1"
        });
        let registeredUser = await User.register(fakeuser, "helloworld");
        res.send(registeredUser);
    
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use('/listings', reservationRoutes);


app.use("/",userrouter);
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    if (err.statusCode === 404) {
        return res.status(404).send('Not Found');
    }
    
    // For all other errors, send the error message to the client
    res.status(500).send(err.message || 'Internal Server Error');
});






const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
