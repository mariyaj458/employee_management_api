const express = require("express");
const mongoose = require("mongoose");
const { corsWithOptions } = require("./middleware/cors");
require("dotenv").config();

const adminManagementRoutes = require("./routes/adminManagementRoute");
const userAuthRoutes = require("./routes/userAuthRoutes");
const uploadRoutes = require("./routes/uploadRouter");
const employeeRoute = require("./routes/employeeRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(corsWithOptions);
app.use(express.json());

app.use("/api/admin", adminManagementRoutes);
app.use("/api/auth", userAuthRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/employee", employeeRoute);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", (err) => console.log("MongoDB Connection Error:", err));
db.once("open", () => console.log("MongoDB connected successfully"));

module.exports = app;
