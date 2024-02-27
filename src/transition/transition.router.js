const express = require("express");
const { addTransition, cashOut } = require("./transition.controller");

const router = express.Router();

// User Registration (Signup)
router.post("/add", addTransition);
router.post("/cashOut", cashOut);

module.exports = router;
