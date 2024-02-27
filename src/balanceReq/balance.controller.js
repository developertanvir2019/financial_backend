const User = require("../authentication/user.model");
const uuid = require("uuid"); // Importing UUID
const Balance = require("./balance.model");
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
    res
      .status(500)
      .json({
        error: "Failed to Balance Recharge request",
        details: error.message,
      });
  }
};
