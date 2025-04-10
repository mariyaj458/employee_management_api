const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Employee = require("../models/employee");
const { verifyUser } = require("../authenticate");
const { searchAndFilterEmployees } = require("../utils/employeeController");

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) next();
  else res.status(403).json({ message: "Admin Only" });
};

router.post("/AddBasicDetails", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { firstName, lastName, dob, gender, mobileNumber, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found with this email" });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists with this email",
      });
    }

    const newEmployee = new Employee({
      firstName,
      lastName,
      dob,
      gender,
      mobileNumber,
      email,
      userId: user._id,
      createdBy: req.user._id,
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      message: "Employee basic details added successfully",
      employee: newEmployee,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put(
  "/UpdateBasicDetails/:id",
  verifyUser,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, dob, gender, mobileNumber } = req.body;

      let employee = await Employee.findById(id);

      if (!employee) {
        employee = await Employee.findOne({ userId: id });
      }

      if (!employee) {
        return res
          .status(404)
          .json({ success: false, message: "Employee not found" });
      }

      employee.firstName = firstName;
      employee.lastName = lastName;
      employee.dob = dob;
      employee.gender = gender;
      employee.mobileNumber = mobileNumber;

      await employee.save();

      res.status(200).json({
        success: true,
        message: "Employee details updated successfully",
        employee,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// router.get("/GetAllEmployeeDetails", verifyUser,verifyAdmin, async (req, res) => {
//   try {
//     const employee = await Employee.find();

//     res.status(200).json({
//       success: true,
//       message: "Employee list fetched successfully",
//       data: employee,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

router.get(
  "/GetAllEmployeeDetails",
  verifyUser,
  verifyAdmin,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalEmployees = await Employee.countDocuments();
      const employees = await Employee.find()
        .skip(skip)
        .limit(limit)
        .populate("userId createdBy");

      res.status(200).json({
        success: true,
        message: "Employee list fetched successfully",
        totalEmployees,
        totalPages: Math.ceil(totalEmployees / limit),
        currentPage: page,
        data: employees,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.get(
  "/GetEmployeeDetailsById/:id",
  verifyUser,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Employee details fetched sucessfully",
        data: employee,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

router.delete(
  "/DeleteEmployee/:id",
  verifyUser,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      let employee = await Employee.findById(id);

      if (!employee) {
        employee = await Employee.findOne({ userId: id });
      }

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      await employee.deleteOne();

      res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

router.delete("/DeleteAllUsers", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const result = await Employee.deleteMany({ admin: false });

    res.status(200).json({
      success: true,
      message: `All non admin employees deleted successfully. Total deleted: ${result.deletedCount}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get(
  "/SearchEmployee",
  verifyUser,
  verifyAdmin,
  searchAndFilterEmployees
);

module.exports = router;
