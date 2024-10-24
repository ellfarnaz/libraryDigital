const db = require("../config/database");

class Loan {
  static async create(userId, bookId, loanDate, dueDate) {
    const [result] = await db.execute(
      "INSERT INTO loans (user_id, book_id, loan_date, due_date, status) VALUES (?, ?, ?, ?, 'pending')",
      [userId, bookId, loanDate, dueDate]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM loans WHERE id = ?", [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute(
      `
      SELECT 
        loans.*,
        books.title,
        books.author,
        books.genres,
        books.cover_image,
        users.username,
        returns.return_date
      FROM 
        loans
      INNER JOIN 
        books ON loans.book_id = books.id
      INNER JOIN 
        users ON loans.user_id = users.id
      LEFT JOIN
        returns ON loans.id = returns.loan_id
      WHERE 
        loans.user_id = ?
    `,
      [userId]
    );
    return rows;
  }

  static async update(id, updateData) {
    try {
      const keys = Object.keys(updateData);
      const values = Object.values(updateData);
      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const query = `UPDATE loans SET ${setClause} WHERE id = ?`;
      const [result] = await db.execute(query, [...values, id]);
      return result.affectedRows;
    } catch (error) {
      console.error("Error in Loan.update:", error);
      throw error;
    }
  }

  static async delete(id) {
    console.log("Deleting loan with ID:", id);
    const [result] = await db.execute("DELETE FROM loans WHERE id = ?", [id]);
    console.log("Deleted rows:", result.affectedRows);
    return result.affectedRows;
  }
}

module.exports = Loan;
