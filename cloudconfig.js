const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// To connect backend with cloudinary account
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


// To define storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormat: ["png", "jpeg", "jpg"], 
    },
  });

  module.exports = {
    cloudinary,
    storage
  }