const express = require("express");
const router = express.Router();
const { verifyUser } = require("../authenticate");

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) next();
  else res.status(403).json({ message: "Admin Only" });
};

const {
  addBasicDetails,
  updateEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  deleteAllUsers,
  searchAndFilterEmployees,
} = require("../controllers/adminManagementController");

router.post("/AddBasicDetails", verifyUser, verifyAdmin, addBasicDetails);
router.put("/UpdateBasicDetails/:id", verifyUser, verifyAdmin, updateEmployee);
router.get("/GetAllEmployeeDetails", verifyUser, verifyAdmin, getAllEmployees);
router.get(
  "/GetEmployeeDetailsById/:id",
  verifyUser,
  verifyAdmin,
  getEmployeeById
);
router.delete("/DeleteEmployee/:id", verifyUser, verifyAdmin, deleteEmployee);
router.delete("/DeleteAllUsers", verifyUser, verifyAdmin, deleteAllUsers);
router.get(
  "/SearchEmployee",
  verifyUser,
  verifyAdmin,
  searchAndFilterEmployees
);

module.exports = router;
