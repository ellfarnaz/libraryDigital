const db = require("../config/database");

class BookReport {
  static async create(
    userId,
    reportType,
    description,
    bookTitle,
    requestedTitle,
    requestedGenre,
    reason,
    nama,
    nis
  ) {
    const [result] = await db.execute(
      `INSERT INTO book_reports (user_id, report_type, description, book_title, requested_title, requested_genre, reason, nama, nis)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        reportType,
        description,
        bookTitle,
        requestedTitle,
        requestedGenre,
        reason,
        nama,
        nis,
      ]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM book_reports");
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM book_reports WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute(
      "SELECT * FROM book_reports WHERE user_id = ?",
      [userId]
    );
    return rows;
  }

  static async getReportsByType(reportType) {
    const [rows] = await db.execute(
      "SELECT * FROM book_reports WHERE report_type = ?",
      [reportType]
    );
    return rows;
  }

  static async update(id, updateData) {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE book_reports SET ${setClause} WHERE id = ?`;
    const [result] = await db.execute(query, [...values, id]);
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute("DELETE FROM book_reports WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  }
}

module.exports = BookReport;
