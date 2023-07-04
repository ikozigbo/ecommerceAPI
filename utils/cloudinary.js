// cloudinary version 1 syntax
// const cloudinary = require("cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_KEY,
//   api_secret: process.env.CLOUD_SECRET,
// });

// const cloudinaryUploadImg = async (fileToUpload) => {
//   return new Promise((resolve) => {
//     cloudinary.uploader.upload(fileToUpload, (result) => {
//       resolve(
//         {
//           url: result.secure_url,
//         },
//         {
//           resource_type: "auto",
//         }
//       );
//     });
//   });
// };

// module.exports = { cloudinaryUploadImg };

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const cloudinaryUploadImg = async (fileToUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUpload, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
          // resource_type: result.resource_type,
        });
      }
    });
  });
};

module.exports = { cloudinaryUploadImg };
