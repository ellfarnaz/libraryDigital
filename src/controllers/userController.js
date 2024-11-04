const User = require("../models/user");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const path = require("path");

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newProfilePicture = req.file.filename;
    const userId = req.user.id;

    // Ambil data user yang ada
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hapus foto profil lama jika ada
    if (currentUser.profile_picture) {
      const oldPicturePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        "profiles",
        currentUser.profile_picture
      );
      fs.unlink(oldPicturePath, (err) => {
        if (err) console.error("Error deleting old profile picture:", err);
      });
    }

    const result = await User.updateProfilePicture(userId, newProfilePicture);

    if (result === 0) {
      return res
        .status(404)
        .json({ message: "Failed to update profile picture" });
    }

    res.json({
      message: "Profile picture updated successfully",
      profilePicturePath: newProfilePicture,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating profile picture",
      error: error.message,
    });
  }
};

exports.getProfileInfo = async (req, res) => {
  try {
    const nis = req.query.nis;
    const user = await User.findByNIS(nis);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      nis: user.nis,
      username: user.username,
      mobilePhone: user.mobile_phone,
      profilePicture: user.profile_picture,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile info", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log("Received update profile request:", req.body);
    console.log("File received:", req.file);

    const { username, mobilePhone, password } = req.body;
    const newProfilePicture = req.file ? req.file.filename : null;
    const userId = req.user.id;

    // Validate mobile phone number length
    if (mobilePhone && mobilePhone.length > 15) {
      // Adjust 15 to match your database column length
      return res
        .status(400)
        .json({ message: "Mobile phone number is too long" });
    }

    // Ambil data user yang ada
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let updateData = { username, mobile_phone: mobilePhone };

    if (newProfilePicture) {
      updateData.profile_picture = newProfilePicture;

      // Hapus foto profil lama jika ada
      if (currentUser.profile_picture) {
        const oldPicturePath = path.join(
          __dirname,
          "..",
          "uploads",
          "profiles",
          currentUser.profile_picture
        );
        try {
          await fs.access(oldPicturePath);
          await fs.unlink(oldPicturePath);
          console.log(`Old profile picture deleted: ${oldPicturePath}`);
        } catch (err) {
          console.log("Old profile picture not found or already deleted");
        }
      }
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const result = await User.update(userId, updateData);

    if (result === 0) {
      return res.status(404).json({ message: "Failed to update user" });
    }

    res.json({
      message: "Profile updated successfully",
      profilePicturePath: newProfilePicture,
    });
  } catch (error) {
    console.error("Detailed error in updateProfile:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.toString() });
  }
};
