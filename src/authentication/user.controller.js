const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./user.model");

// User Registration (Signup)
exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, role, nid, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const existingPhoneUser = await User.findOne({ phone });
    if (existingPhoneUser) {
      return res.status(400).json({ error: "Phone already exists" });
    }
    // Check if nid already exists
    const existingNidUser = await User.findOne({ nid });
    if (existingNidUser) {
      return res.status(400).json({ error: "NID already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    let balance;
    if (role === "user") {
      balance = 40;
    } else if (role === "agent") {
      balance = 100000;
    }

    // Create a new user
    const user = new User({
      fullName,
      email,
      phone,
      role,
      nid,
      password: hashedPassword,
      balance,
      isBlock: false,
      isApproved: false,
    });
    // Save the user to the database
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid user or phone number" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Wrong Password" });
    }

    // Create and send a JWT token for authentication
    const key = process.env.secrate_key;
    const token = jwt.sign(
      { userId: user._id, email: user.email, phone: user.phone },
      key,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", detail: error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get user", details: error.message });
  }
};

// total balance
exports.getTotalBalance = async (req, res) => {
  try {
    const users = await User.find({});
    const totalBalance = users.reduce(
      (sum, user) => sum + (user.balance || 0),
      0
    );
    res.json({ totalBalance });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all user

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all balance records
    const users = await User.find({});

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({
      error: "Failed to fetch all users",
      details: error.message,
    });
  }
};
