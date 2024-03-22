const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    api_environment_variable:process.env.CLOUDINARY_URL
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      // async code using `req` and `file`
      // ...
      return {
        folder: 'wanderlust_DEV',
        allowedFormats: ["png","jpg","jpeg"],

      };
    },
  });

  module.exports = {
    cloudinary,
    storage
  }