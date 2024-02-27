const User = require("../authentication/user.model");
const uuid = require("uuid"); // Importing UUID
const Transition = require("./transition.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// Cashout
exports.cashOut = async (req, res) => {
  try {
    const { senderPhone, receiverPhone, amount } = req.body;

    // 1. Minimum amount should be 50 tk
    if (amount < 50) {
      return res.status(400).json({ error: "Minimum amount should be 50 tk" });
    }

    // 2. Check if the receiver's role is user
    const receiver = await User.findOne({ phone: receiverPhone });
    if (!receiver || receiver.role !== "agent") {
      return res.status(400).json({ error: "Must be a agent Number" });
    }
    if (receiver.isApproved === false) {
      return res.status(400).json({ error: "Agent is not verified" });
    }
    let amountWithCharge = Number(amount) * 1.015;
    let amountWithProfit = Number(amount) * 1.01;
    const sender = await User.findOne({ phone: senderPhone });
    if (!sender) {
      return res.status(400).json({ error: "Sender not found" });
    }
    if (sender.balance < amountWithCharge) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    // Update sender's balance and receiver balance

    sender.balance -= amountWithCharge;
    receiver.balance += amountWithProfit;
    await sender.save();
    await receiver.save();
    // 5. Add extra charge to admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      const profitPercent = Number(amount) * 0.005;
      const adminProfit = (profitPercent + 5).toFixed(2);
      admin.balance = Number(admin.balance) + Number(adminProfit);
      admin.save();
    }

    // Generate unique transaction ID
    const transactionId = uuid.v4();

    // Create transaction record
    const transaction = new Transition({
      transitionId: transactionId,
      transition: "cash-out",
      sender: sender.phone,
      receiver: receiver.phone,
      amount: amount,
    });
    await transaction.save();

    res.status(200).json({ message: "Cash Out successfully" });
  } catch (error) {
    console.error("Cash Out error:", error);
    res
      .status(500)
      .json({ error: "Failed to Cash Out", details: error.message });
  }
};

exports.cashIn = async (req, res) => {
  try {
    const { senderPhone, receiverPhone, amount, password } = req.body;

    // 2. Check if the receiver's role is user
    const receiver = await User.findOne({ phone: receiverPhone });
    if (!receiver || receiver.role !== "user") {
      return res.status(400).json({ error: "Must be a user Number" });
    }
    const sender = await User.findOne({ phone: senderPhone });
    if (!sender) {
      return res.status(400).json({ error: "Sender not found" });
    }
    if (sender.isApproved === false) {
      return res.status(400).json({ error: "You are not a verified agent" });
    }

    const isPasswordValid = await bcrypt.compare(password, sender.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Wrong Password" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    // Update sender's balance and receiver balance

    sender.balance -= Number(amount);
    receiver.balance += Number(amount);
    await sender.save();
    await receiver.save();
    // 5. Add extra charge to admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      admin.balance = Number(admin.balance) + 5;
      admin.save();
    }

    // Generate unique transaction ID
    const transactionId = uuid.v4();

    // Create transaction record
    const transaction = new Transition({
      transitionId: transactionId,
      transition: "cash-in",
      sender: sender.phone,
      receiver: receiver.phone,
      amount: amount,
    });
    await transaction.save();

    res.status(200).json({ message: "Cash In successfully" });
  } catch (error) {
    console.error("Cash In error:", error);
    res
      .status(500)
      .json({ error: "Failed to Cash In", details: error.message });
  }
};
