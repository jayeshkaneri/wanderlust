const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");

const upload = multer({ storage })

const listingController = require("../controllers/listing.js");

//Index Route (to show all listings)
router.get("/", wrapAsync(listingController.indexRoute));


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


//Create Route
router.post("/", isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

// router.post("/", upload.single('listing[image]'), (req, res) => {
//     res.send(req.file);
// })


//Show Route (to show specific list)
router.get("/:id", wrapAsync( listingController.showListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


//Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));


//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;



// ******************************************************************************************
// Listing.insertOne({
//     title: "My Home",
//     description: "by the beach",
//     price: 1000,
//     location: "goa",
//     country: "india"
// }).then((res) => {
//     console.log("data saved");
// })
// .catch((err) => {
//     console.log(err);
// })


// app.get("/sampleTesting", async (req, res) => {
//     let sample = new Listing({
//         title: "My Home",
//         description: "by the beach",
//         price: 1000,
//         location: "goa",
//         country: "india"
//     })

//     await sample.save();
//     console.log("data saved");
//     res.send("test successful");
// })


//Create Route (method-1 to insert new data into database)
// router.post("/listings", async (req, res) => {
//     let {title, description, image, price, location, country} = req.body;
//     await Listing.insertOne({title: title, description: description, image: image, price: price, location: location, country: country});
//     res.redirect("/listings");  
// })