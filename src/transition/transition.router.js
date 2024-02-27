const express = require("express");
const { addTransition } = require("./transition.controller");

const router = express.Router();

// User Registration (Signup)
router.post("/add", addTransition);

module.exports = router;
