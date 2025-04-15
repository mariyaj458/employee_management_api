const User = require("../models/user");
const Employee = require("../models/employee");
const {
  notFoundError,
  conflictError,
  badRequestError,
  createError,
} = require("../utils/commonErrors");

exports.addBasicDetails = async (req, res, next) => {
  try {
    const { firstName, lastName, dob, gender, mobileNumber, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(notFoundError("User"));

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return next(conflictError("Employee already exists with this email"));
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
    next(createError(err.message));
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, dob, gender, mobileNumber } = req.body;

    let employee =
      (await Employee.findById(id)) || (await Employee.findOne({ userId: id }));

    if (!employee) return next(notFoundError("Employee"));

    Object.assign(employee, {
      firstName,
      lastName,
      dob,
      gender,
      mobileNumber,
    });

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee details updated successfully",
      employee,
    });
  } catch (err) {
    next(createError(err.message));
  }
};

exports.getAllEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalEmployees = await Employee.countDocuments();
    const employees = await Employee.find()
      .skip(skip)
      .limit(limit)
      .populate("userId createdBy");

    const genderStats = await Employee.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      message: "Employee list fetched successfully",
      totalEmployees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: page,
      genderStats,
      data: employees,
    });
  } catch (err) {
    next(createError(err.message));
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) return next(notFoundError("Employee"));

    res.status(200).json({
      success: true,
      message: "Employee details fetched successfully",
      data: employee,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    let employee = await Employee.findById(id);
    if (!employee) {
      employee = await Employee.findOne({ userId: id });
    }

    if (!employee) return next(notFoundError("Employee"));

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    next(createError(err.message));
  }
};

exports.deleteAllUsers = async (req, res, next) => {
  try {
    const result = await Employee.deleteMany({ admin: false });

    res.status(200).json({
      success: true,
      message: `All non-admin employees deleted successfully. Total deleted: ${result.deletedCount}`,
    });
  } catch (err) {
    next(createError(err.message));
  }
};

exports.searchAndFilterEmployees = async (req, res, next) => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "gender",
      "email",
      "city",
      "state",
      "country",
      "addressType",
    ];

    const invalidParams = Object.keys(req.query).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidParams.length > 0) {
      return next(
        badRequestError(
          `Invalid query parameter(s): ${invalidParams.join(", ")}`
        )
      );
    }

    const {
      firstName,
      lastName,
      gender,
      email,
      city,
      state,
      country,
      addressType,
    } = req.query;

    let query = {};

    if (firstName) query.firstName = new RegExp("^" + firstName, "i");
    if (lastName) query.lastName = new RegExp("^" + lastName, "i");
    if (gender) query.gender = gender;
    if (email) query.email = new RegExp("^" + email, "i");

    if (city || state || country || addressType) {
      query.addresses = {
        $elemMatch: {
          ...(city && { city: new RegExp(city, "i") }),
          ...(state && { state: new RegExp(state, "i") }),
          ...(country && { country: new RegExp(country, "i") }),
          ...(addressType && { addressType }),
        },
      };
    }

    const employees = await Employee.find(query).populate("userId createdBy");

    res.status(200).json({
      success: true,
      message: "Filtered employees fetched successfully",
      data: employees,
    });
  } catch (err) {
    next(createError(err.message));
  }
};
