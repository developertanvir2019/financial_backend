const express = require("express");
const { login, signup, getUserById } = require("./user.controller");

const router = express.Router();

// User Registration (Signup)
router.post("/signup", signup);

// User Login
router.post("/login", login);
router.get("/:id", getUserById);

module.exports = router;
