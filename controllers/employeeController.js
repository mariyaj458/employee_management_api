const Employee = require("../models/employee");
const { notFoundError, badRequestError } = require("../utils/commonErrors");

exports.addAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addresses = req.body.addresses;

    if (!Array.isArray(addresses)) {
      return next(badRequestError("Addresses must be an array"));
    }

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return next(notFoundError("Employee"));
    }

    employee.addresses.push(...addresses);
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Addresses added successfully",
      employee,
    });
  } catch (err) {
    next(createError(err.message));
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const updatedAddress = req.body;

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return next(notFoundError("Employee"));
    }

    const address = employee.addresses.id(addressId);
    if (!address) {
      return next(notFoundError("Address"));
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
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return next(notFoundError("Employee"));
    }
    const addressIndex = employee.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return next(notFoundError("Address"));
    }
    employee.addresses.splice(addressIndex, 1);
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      employee,
    });
  } catch (err) {
    next(createError(err.message));
  }
};

exports.profileDetails = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });

    if (!employee) {
      return next(notFoundError("Employee"));
    }
    res.status(200).json({
      success: true,
      message: "Employee profile fetched successfully",
      employee,
    });
  } catch (err) {
    next(createError(err.message));
  }
};
