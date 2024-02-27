const express = require("express");
const {
  login,
  signup,
  getUserById,
  getTotalBalance,
} = require("./user.controller");

const router = express.Router();

// User Registration (Signup)
router.post("/signup", signup);

// User Login
router.post("/login", login);
router.get("/totalBalance", getTotalBalance);
router.get("/getUser/:id", getUserById);

module.exports = router;
