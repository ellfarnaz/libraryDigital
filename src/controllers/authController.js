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
    const { nis, password } = req.body;
    const user = await User.findByNIS(nis);

    if (!user) {
      return res.status(401).json({ message: "Invalid NIS or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid NIS or password" });
    }

    const token = jwt.sign(
      { id: user.id, nis: user.nis, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
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
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Admin login successful", token, role: admin.role });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during admin login", error: error.message });
  }
};
