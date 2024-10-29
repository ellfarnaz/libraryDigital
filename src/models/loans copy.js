const db = require("../config/database");

class Loan {
  static async findByUserId(userId) {
    console.log("Finding loans for user ID:", userId);
    const [rows] = await db.execute(
      `
        SELECT
          loans.id,
          loans.user_id,
          loans.book_id,
          loans.loan_date,
          loans.due_date,
          CASE
            WHEN loans.status = 'loaned' THEN 'Dipinjam'
            ELSE loans.status
          END AS status,
          books.title AS book_title,
          books.author AS book_author,
          JSON_UNQUOTE(JSON_EXTRACT(books.genres, '$')) AS book_genres,
          books.cover_image AS book_cover_image,
          users.username
        FROM
          loans
        INNER JOIN
          books ON loans.book_id = books.id
        INNER JOIN
          users ON loans.user_id = users.id
        WHERE
          loans.user_id = ?
          AND loans.status != 'returned'
      `,
      [userId]
    );
    console.log("Loans found for user ID", userId, ":", rows);
    return rows;
  }

  static async findAll() {
    const [rows] = await db.execute(`
      SELECT
        loans.id,
        loans.user_id,
        loans.book_id,
        loans.loan_date,
        loans.due_date,
        CASE
          WHEN loans.status = 'loaned' THEN 'Dipinjam'
          ELSE loans.status
        END AS status,
        books.title AS book_title,
        books.author AS book_author,
        JSON_UNQUOTE(JSON_EXTRACT(books.genres, '$')) AS book_genres,
        books.cover_image AS book_cover_image,
        users.username
      FROM
        loans
      INNER JOIN
        books ON loans.book_id = books.id
      INNER JOIN
        users ON loans.user_id = users.id
      WHERE
        loans.status != 'returned'
      ORDER BY
        loans.id ASC
    `);
    console.log("All loans fetched from the database:", rows);
    return rows;
  }

  static async getMonthlyLoanData() {
    const [rows] = await db.execute(`
      SELECT 
        DATE_FORMAT(loan_date, '%Y-%m-01') AS month,
        COUNT(*) AS count
      FROM 
        loans
      WHERE 
        loan_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
      GROUP BY 
        DATE_FORMAT(loan_date, '%Y-%m-01')
      ORDER BY 
        month
    `);
    return rows;
  }

  static async countByStatus(status) {
    if (status === undefined) {
      return 0; // Atau nilai lain yang sesuai dengan kebutuhan Anda
    }

    const [rows] = await db.execute(
      "SELECT COUNT(*) AS count FROM loans WHERE status = ?",
      [status]
    );
    console.log("Loan count by status", status, ":", rows[0].count);
    return rows[0].count;
  }

  static async create(userId, bookId, loanDate, dueDate) {
    const [result] = await db.execute(
      "INSERT INTO loans (user_id, book_id, loan_date, due_date, status) VALUES (?, ?, ?, ?, 'pending')",
      [userId, bookId, loanDate, dueDate]
    );
    return result.insertId;
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
