const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../utils/uploadController");
const { verifyUser } = require("../authenticate");
const Employee = require("../models/employee");
const fs = require("fs");

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Max size is 500KB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Multer error: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
  next();
};

// Upload profile picture
router.post(
  "/UploadProfilePic",
  verifyUser,
  (req, res, next) => {
    upload.single("profilePic")(req, res, function (err) {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  async (req, res) => {
    try {
      const employee = await Employee.findOne({ userId: req.user.id });
      if (!employee) {
        return res
          .status(404)
          .json({ success: false, message: "Employee not found" });
      }

      const filePath = req.file?.path;
      if (!filePath) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      if (employee.profilePic && fs.existsSync(employee.profilePic)) {
        fs.unlinkSync(employee.profilePic);
      }

      employee.profilePic = filePath;
      await employee.save();

      res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        employee,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Delete profile picture
router.delete("/DeleteProfilePic", verifyUser, async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    if (employee.profilePic && fs.existsSync(employee.profilePic)) {
      fs.unlinkSync(employee.profilePic);
    }

    employee.profilePic = null;
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Profile picture deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Upload resume
router.post(
  "/UploadResume",
  verifyUser,
  (req, res, next) => {
    upload.single("resume")(req, res, function (err) {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  async (req, res) => {
    try {
      const employee = await Employee.findOne({ userId: req.user.id });
      if (!employee) {
        return res
          .status(404)
          .json({ success: false, message: "Employee not found" });
      }

      const filePath = req.file?.path;
      if (!filePath) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      if (employee.resume && fs.existsSync(employee.resume)) {
        fs.unlinkSync(employee.resume);
      }

      employee.resume = filePath;
      await employee.save();

      res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        employee,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Delete resume
router.delete("/DeleteResume", verifyUser, async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    if (employee.resume && fs.existsSync(employee.resume)) {
      fs.unlinkSync(employee.resume);
    }

    employee.resume = null;
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
