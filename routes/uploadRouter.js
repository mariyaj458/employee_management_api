const express = require("express");
const router = express.Router();
const {
  uploadProfilePic,
  deleteProfilePic,
  uploadResume,
  deleteResume,
} = require("../controllers/uploadController");
const { verifyUser } = require("../authenticate");
const upload = require("../utils/uploadService");
const { badRequestError, createError } = require("../utils/commonErrors");

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(badRequestError("File too large. Max size is 500KB"));
    }
    return next(badRequestError(`Multer error: ${err.message}`));
  } else if (err) {
    return next(badRequestError(`${err.message} || "Something went wrong"`));
  }
  next(createError(err.message));
};

router.post(
  "/UploadProfilePic",
  verifyUser,
  (req, res, next) => {
    upload.single("profilePic")(req, res, function (err) {
      if (err) return handleMulterError(err, req, res, next);
      next(createError(err.message));
    });
  },
  uploadProfilePic
);

router.delete("/deleteProfilePic", verifyUser, deleteProfilePic);

router.post(
  "/UploadResume",
  verifyUser,
  (req, res, next) => {
    upload.single("resume")(req, res, function (err) {
      if (err) return handleMulterError(err, req, res, next);
      next(createError(err.message));
    });
  },
  uploadResume
);

router.delete("/DeleteResume", verifyUser, deleteResume);

module.exports = router;
