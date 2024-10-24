const db = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async create(nis, username, mobilePhone, password, role = "user") {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (nis, username, mobile_phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [nis, username, mobilePhone, hashedPassword, role]
    );
    return result.insertId;
  }
  static async findAll() {
    const [rows] = await db.execute(
      "SELECT id, nis, username, mobile_phone, role FROM users WHERE nis IS NOT NULL AND nis != ''"
    );
    return rows;
  }
  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }
  static async findByNIS(nis) {
    const [rows] = await db.execute("SELECT * FROM users WHERE nis = ?", [nis]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  // Tambahkan method ini ke dalam class User
  static async updateProfilePicture(userId, profilePicturePath) {
    const [result] = await db.execute(
      "UPDATE users SET profile_picture = ? WHERE id = ?",
      [profilePicturePath, userId]
    );
    return result.affectedRows;
  }
  static async update(id, updateData) {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE users SET ${setClause} WHERE id = ?`;
    const [result] = await db.execute(query, [...values, id]);
    return result.affectedRows;
  }
  static async delete(id) {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows;
  }
}

module.exports = User;
