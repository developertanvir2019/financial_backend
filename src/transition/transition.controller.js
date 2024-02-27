const User = require("../authentication/user.model");
const uuid = require("uuid"); // Importing UUID
const Transition = require("./transition.model");

exports.addTransition = async (req, res) => {
  try {
    const { senderPhone, receiverPhone, amount } = req.body;

    // 1. Minimum amount should be 50 tk
    if (amount < 50) {
      return res.status(400).json({ error: "Minimum amount should be 50 tk" });
    }

    // 2. Check if the receiver's role is user
    const receiver = await User.findOne({ phone: receiverPhone });
    if (!receiver || receiver.role !== "user") {
      return res.status(400).json({ error: "Receiver must be a user" });
    }

    // 3. Check if extra charge applies
    let finalAmount = Number(amount);
    let extraCharge = 0;
    if (amount > 100) {
      extraCharge = 5;
      finalAmount += extraCharge;
    }

    // 4. Deduct amount from sender's balance
    const sender = await User.findOne({ phone: senderPhone });
    if (!sender) {
      return res.status(400).json({ error: "Sender not found" });
    }

    if (sender.balance < finalAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Update sender's balance
    sender.balance -= finalAmount;
    receiver.balance += Number(amount);
    await sender.save();
    await receiver.save();
    // 5. Add extra charge to admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      admin.balance += extraCharge;
      admin.save();
    }

    // Generate unique transaction ID
    const transactionId = uuid.v4();

    // Create transaction record
    const transaction = new Transition({
      transitionId: transactionId,
      transition: "send-money",
      sender: sender.phone,
      receiver: receiver.phone,
      amount: finalAmount,
    });
    await transaction.save();

    res.status(200).json({ message: "Money sent successfully" });
  } catch (error) {
    console.error("Send money error:", error);
    res
      .status(500)
      .json({ error: "Failed to send money", details: error.message });
  }
};
