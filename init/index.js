const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main().then(() => {
    console.log("connection successful");
})
.catch( err => console.log(err) );

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "67c321c499e40167700b2928"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();