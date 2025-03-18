const User = require("../models/user.js");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signup = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email: email, username: username});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust")
            res.redirect("/listings");
        })
    } catch(err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
}; 


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login = async (req, res) => {
    req.flash("success", `Welcome back to Wanderlust, ${req.body.username}`)
    res.redirect(res.locals.saveRedirect  || "/listings");
};


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You logged out successfully");
        res.redirect("/listings");
    })
};