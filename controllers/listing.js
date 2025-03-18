const Listing = require("../models/listing.js");

module.exports.indexRoute = async (req, res) => {
    const allListings = await Listing.find();
    // res.locals.success = req.flash("success")   ---we can also pass flash message like this but we used middleware
    res.render("listings/index.ejs", {allListings});
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    console.log(newListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    
};


module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const list = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!list) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {list});
};

 
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const list = await Listing.findById(id);
    if(!list) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let originalImageUrl = list.image.url;
    originalImageUrl = list.image.url.replace("/upload", "/upload/h_200,w_250/e_blur:100");
    res.render("listings/edit.ejs", {list, originalImageUrl});
};


module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true, new: true});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url, filename};
        await updatedListing.save();
    }
    
    console.log(updatedListing);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
};