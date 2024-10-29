const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { nis, username, mobilePhone, password } = req.body;

    const existingUser = await User.findByNIS(nis);
    if (existingUser) {
      return res.status(400).json({ message: "NIS already registered" });
    }

    const userId = await User.create(nis, username, mobilePhone, password);
    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Login attempt with:", req.body);
    const { nis, password } = req.body;

    const user = await User.findByNIS(nis);
    console.log("User found:", user);

    if (!user) {
      console.log("No user found with NIS:", nis);
      return res.status(401).json({ message: "Invalid NIS or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Is password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password for NIS:", nis);
      return res.status(401).json({ message: "Invalid NIS or password" });
    }

    const token = jwt.sign(
      { id: user.id, nis: user.nis, username: user.username, role: user.role },
      process.env.JWT_SECRET
    );

    // Menambahkan informasi user yang diperlukan oleh client
    const userInfo = {
      nis: user.nis,
      username: user.username,
      profilePicture: user.profile_picture || null,
    };
    console.log("User info to be sent:", userInfo);

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: userInfo,
    });
    console.log("Login successful for NIS:", nis);
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findByEmail(email);

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET
    );

    res.json({ message: "Admin login successful", token, role: admin.role });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during admin login", error: error.message });
  }
};
