const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};
module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("/signup");
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    let redirectUrl = res.locals.redirectUrl || '/listings'; // Use res.locals.redirectUrl
    req.flash("success", "Welcome to Wanderlust! You are logged in!");
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    try {
        req.logout(function(err) {
            if (err) {
                console.error("Logout error:", err);
                req.flash("error", "Logout failed");
            } else {
                req.flash("success", "You are logged out!");
            }
            res.redirect("/listings"); // Redirect to home or public page
        });
    } catch (err) {
        console.error("Logout error:", err);
        req.flash("error", "Logout failed");
        res.redirect("/listings"); // Redirect to home or login page
    }
};