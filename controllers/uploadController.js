const fs = require("fs");
const Employee = require("../models/employee");

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
