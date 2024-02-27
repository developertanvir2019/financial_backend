const express = require("express");
const { balanceReq } = require("./balance.controller");

const router = express.Router();

// User Registration (Signup)
router.post("/add", balanceReq);

module.exports = router;
