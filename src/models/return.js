const db = require("../config/database");

class Return {
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
}

module.exports = Return;
