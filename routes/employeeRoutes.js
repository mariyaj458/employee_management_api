const express = require("express");
const router = express.Router();
const { verifyUser } = require("../authenticate");

const {
  addAddress,
  updateAddress,
  deleteAddress,
  profileDetails,
} = require("../controllers/employeeController");

router.post("/AddAddresses", verifyUser, addAddress);
router.put("/UpdateAddress/:addressId", verifyUser, updateAddress);
router.delete("/DeleteAddress/:addressId", verifyUser, deleteAddress);
router.get("/Profile", verifyUser, profileDetails);

module.exports = router;
