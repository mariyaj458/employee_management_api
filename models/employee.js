const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    houseName: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    addressType: {
      type: String,
      enum: ["Permanent", "Temporary", "Other"],
      default: "Other",
    },
  },
  { timestamps: true, strict: true }
);

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    mobileNumber: { type: Number, required: true },
    email: { type: String, require: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    profilePic: {
      type: String,
    },
    resume: {
      type: String,
    },
    addresses: [addressSchema],
  },
  { timestamps: true, strict: true, }
);

module.exports = mongoose.model("Employee", employeeSchema);
