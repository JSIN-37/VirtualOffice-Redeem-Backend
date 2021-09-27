// MULTER
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../uploads");
  },
  filename: (req, file, cb) => {
    // Set our own file name
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../uploads");
  },
  filename: (req, file, cb) => {
    // Set SAME file name, everything will be saved as "ORGANIZATION_LOGO.JPEG" :P
    cb(null, "ORGANIZATION_LOGO.JPEG");
  },
});

const upload = multer({ storage: storage }).single("file");
const uploadLogo = multer({ storage: logoStorage }).single("file");

module.exports = { upload, uploadLogo };
