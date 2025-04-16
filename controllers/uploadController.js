const fs = require("fs");
const Employee = require("../models/employee");
const { badRequestError, createError } = require("../utils/commonErrors");
const path = require("path");

exports.uploadProfilePic = async (req, res) => {
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
};

exports.getProfilePic = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(badRequestError("User not authenticated"));
    }
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee || !employee.profilePic) {
      return next(badRequestError("Profile picture not found"));
    }
    const filePath = path.resolve(employee.profilePic);
    if (!fs.existsSync(filePath)) {
      return next(badRequestError("Profile picture not found"));
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error("Error in getProfilePic:", err);
    next(createError("Failed to retrieve profile picture"));
  }
};

exports.deleteProfilePic = async (req, res) => {
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
};

exports.uploadResume = async (req, res) => {
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
};

exports.downloadResume = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });

    if (!employee || !employee.resume) {
      return next(badRequestError("Resume not found"));
    }
    const filePath = path.resolve(employee.resume);

    if (!fs.existsSync(filePath)) {
      return next(badRequestError("Resume file does not exist on the server"));
    }
    res.download(filePath, (err) => {
      if (err) {
        console.error("Download error:", err);
        return next(createError("Failed to download resume"));
      }
    });
  } catch (err) {
    console.error("Error in downloadResume:", err);
    next(createError("Server error while downloading resume"));
  }
};

// Delete Resume
exports.deleteResume = async (req, res) => {
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
};
