const express = require("express");
const mongoose = require("mongoose");
const { corsWithOptions } = require("./middleware/cors");
require("dotenv").config();

const employeeRoutes = require("./routes/employeeRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const uploadRoutes = require("./routes/uploadRouter");
const employeeAddressRoute = require("./routes/employeeAddressRoute");

const app = express();

app.use(corsWithOptions);
app.use(express.json());

app.use("/api/employee", employeeRoutes);
app.use("/api/auth", userAuthRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/address", employeeAddressRoute);

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", (err) => console.log("MongoDB Connection Error:", err));
db.once("open", () => console.log("MongoDB connected successfully"));

module.exports = app;
