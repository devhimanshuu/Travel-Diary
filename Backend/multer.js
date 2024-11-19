const multer = require("multer");
const path = require("path");

//Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); //Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique File name
  },
});

//File filter to accept only images

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed", false));
  }
};

//Intialize multer
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;