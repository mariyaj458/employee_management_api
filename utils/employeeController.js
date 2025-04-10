const Employee = require("../models/employee");

exports.searchAndFilterEmployees = async (req, res) => {
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
      return res.status(400).json({
        message: `Invalid query parameter(s): ${invalidParams.join(", ")}`,
      });
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

    res.status(200).json(employees);
  } catch (err) {
    console.error("Error in search/filter:", err);
    res.status(500).json({ message: "Server error" });
  }
};
