const bcrypt = require("bcrypt");
const db = require("../src/config/database");

async function createAdmin() {
  const username = "admin";
  const password = "admin123456"; // Ganti dengan password yang lebih aman
  const email = "admin@gmail.com";
  const role = "admin";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, role]
    );
    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    process.exit();
  }
}

createAdmin();
