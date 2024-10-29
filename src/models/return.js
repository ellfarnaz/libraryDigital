const db = require("../config/database");

class Return {
  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM returns");
    return rows;
  }
  static async create(loanId) {
    const [result] = await db.execute(
      "INSERT INTO returns (loan_id, return_date) VALUES (?, CURRENT_TIMESTAMP)",
      [loanId]
    );
    return result.insertId;
  }

  static async findByLoanId(loanId) {
    const [rows] = await db.execute("SELECT * FROM returns WHERE loan_id = ?", [
      loanId,
    ]);
    return rows[0];
  }
  static async deleteByLoanId(loanId) {
    console.log("Deleting returns with loan ID:", loanId);
    const [result] = await db.execute("DELETE FROM returns WHERE loan_id = ?", [
      loanId,
    ]);
    console.log("Deleted rows from returns:", result.affectedRows);
    return result.affectedRows;
  }
  static async findAllWithBookDetails() {
    const [rows] = await db.execute(`
      SELECT 
        returns.id,
        returns.loan_id,
        returns.return_date,
        loans.loan_date,
        books.title AS book_title,
        books.author AS book_author,
        JSON_UNQUOTE(JSON_EXTRACT(books.genres, '$')) AS book_genres,
        books.cover_image AS book_cover_image
      FROM 
        returns
      INNER JOIN
        loans ON returns.loan_id = loans.id
      INNER JOIN
        books ON loans.book_id = books.id
      ORDER BY
        returns.return_date DESC
    `);
    return rows;
  }
}

module.exports = Return;
