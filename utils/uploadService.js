const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profilePic") {
      cb(null, "uploads/profilePics/");
    } else if (file.fieldname === "resume") {
      cb(null, "uploads/resumes/");
    } else {
      cb(new Error("Invalid field name"));
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 }, // 500KB
  fileFilter: function (req, file, cb) {
    const allowedTypes = {
      profilePic: /jpeg|jpg|png/,
      resume: /pdf|doc|docx/,
    };

    const ext = path.extname(file.originalname).toLowerCase().substring(1);
    const expectedType = allowedTypes[file.fieldname];
    if (!expectedType) {
      return cb(new Error("Unexpected field"));
    }

    if (expectedType.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}`));
    }
  },
});

module.exports = upload;
