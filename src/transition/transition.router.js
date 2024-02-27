const express = require("express");
const {
  addTransition,
  cashOut,
  cashIn,
  addMoneyToAgent,
} = require("./transition.controller");

const router = express.Router();

// User Registration (Signup)
router.post("/add", addTransition);
router.post("/cashOut", cashOut);
router.post("/cashIn", cashIn);
router.post("/addMoney", addMoneyToAgent);

module.exports = router;
