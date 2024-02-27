const express = require("express");
const { addTransition, cashOut, cashIn } = require("./transition.controller");

const router = express.Router();

// User Registration (Signup)
router.post("/add", addTransition);
router.post("/cashOut", cashOut);
router.post("/cashIn", cashIn);

module.exports = router;
