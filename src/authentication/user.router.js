const express = require("express");
const { login, signup } = require("./user.controller");

const router = express.Router();

// User Registration (Signup)
router.post("/signup", signup);

// User Login
router.post("/login", login);

module.exports = router;
