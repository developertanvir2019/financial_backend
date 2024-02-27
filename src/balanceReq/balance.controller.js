const User = require("../authentication/user.model");
const uuid = require("uuid"); // Importing UUID
const Balance = require("./balance.model");
const Transaction = require("../transition/transition.model");
exports.balanceReq = async (req, res) => {
  try {
    const { senderPhone, amount } = req.body;
    const sender = await User.findOne({ phone: senderPhone });
    // 5. Add extra charge to admin
    const admin = await User.findOne({ role: "admin" });
    // Generate unique transaction ID
    const transactionId = uuid.v4();

    // Create transaction record
    const balance = new Balance({
      transitionId: transactionId,
      transition: "balance-recharge",
      sender: admin.phone,
      receiver: sender.phone,
      amount: amount,
    });
    await balance.save();

    res.status(200).json({ message: "Balance recharge Request success" });
  } catch (error) {
    console.error("Balance Recharge request error:", error);
    res.status(500).json({
      error: "Failed to Balance Recharge request",
      details: error.message,
    });
  }
};

exports.getAllBalances = async (req, res) => {
  try {
    // Fetch all balance records
    const balances = await Balance.find({});

    res.status(200).json({ balances });
  } catch (error) {
    console.error("Error fetching all balances:", error);
    res.status(500).json({
      error: "Failed to fetch all balances",
      details: error.message,
    });
  }
};

exports.addTransactionAndDeleteBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const balance = await Balance.findById(id);

    if (!balance) {
      return res.status(404).json({ error: "Balance record not found" });
    }
    // Create transaction record
    const transaction = new Transaction({
      transitionId: balance.transitionId,
      transition: "balance-recharge",
      sender: balance.sender,
      receiver: balance.receiver,
      amount: balance.amount,
    });
    await transaction.save();

    // Delete the balance record
    await Balance.deleteOne({ _id: id });

    res.status(200).json({
      message: "Balance Added successfully in agent account",
    });
  } catch (error) {
    console.error("Error adding transaction and deleting balance:", error);
    res.status(500).json({
      error: "Failed to add transaction and delete balance",
      details: error.message,
    });
  }
};
