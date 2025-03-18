const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js")

// Route Middleware to Authenticate/Verify user is logged in or not 
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please log in to access this feature.");
        return res.redirect("/login");
    }
    next(); 
}


module.exports.saveRedirect = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.saveRedirect = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// Middleware (Server-side Validation for new listing)
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        console.log(error);
        throw new ExpressError(400, error);
    } else {
        next();
    }
}


// Middleware (Server-side Validation for new review)
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        console.log(error);
        throw new ExpressError(400, error);
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}