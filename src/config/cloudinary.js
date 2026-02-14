const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();


cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret,
});



const uploadCloudenary = async (fileBuffer) => {
  console.log("cloud_name",process.env.cloud_name);
  console.log("api_secret",process.env.cloud_api_secret);
  console.log("api_key",process.env.cloud_api_key);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    ).end(fileBuffer);
  });
};

module.exports = uploadCloudenary;
