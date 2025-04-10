const express = require("express");
const router = express.Router();
const { verifyUser } = require("../authenticate");
const Employee = require("../models/employee");

router.post("/AddAddresses", verifyUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = req.body.addresses;

    if (!Array.isArray(addresses)) {
      return res.status(400).json({
        success: false,
        message: "Addresses must be an array",
      });
    }

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    employee.addresses.push(...addresses);
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Addresses added successfully",
      employee,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/UpdateAddress/:addressId", verifyUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const updatedAddress = req.body;

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const address = employee.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    Object.assign(address, updatedAddress);
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      employee,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/DeleteAddress/:addressId", verifyUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const addressIndex = employee.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    employee.addresses.splice(addressIndex, 1);
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      employee,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/Profile", verifyUser, async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee profile fetched successfully",
      employee,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
