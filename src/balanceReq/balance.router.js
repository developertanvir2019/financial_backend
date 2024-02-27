const express = require("express");
const {
  balanceReq,
  getAllBalances,
  addTransactionAndDeleteBalance,
} = require("./balance.controller");

const router = express.Router();

// User Registration (Signup)
router.post("/add", balanceReq);
router.post("/transaction-and-delete/:id", addTransactionAndDeleteBalance);
router.get("/all", getAllBalances);

module.exports = router;
