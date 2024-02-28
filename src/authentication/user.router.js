const express = require("express");
const {
  login,
  signup,
  getUserById,
  getTotalBalance,
  getAllUsers,
  approveUser,
  blockUser,
} = require("./user.controller");

const router = express.Router();

// User Registration (Signup)
router.post("/signup", signup);

// User Login
router.post("/login", login);
router.get("/totalBalance", getTotalBalance);
router.get("/all", getAllUsers);
router.get("/getUser/:id", getUserById);

router.put("/approve/:id", approveUser);
router.put("/block/:id", blockUser);
module.exports = router;
