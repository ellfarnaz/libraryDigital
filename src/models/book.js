const db = require("../config/database");

class Book {
  static async create(title, author, isbn, coverImage, genres, status) {
    const [result] = await db.execute(
      "INSERT INTO books (title, author, isbn, cover_image, genres, status) VALUES (?, ?, ?, ?, ?, ?)",
      [title, author, isbn, coverImage, JSON.stringify(genres), status]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM books");
    return rows.map((row) => ({
      ...row,
      genres: JSON.parse(row.genres || "[]"),
    }));
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      console.error("Error in Book.findById:", error);
      throw error;
    }
  }
  static async update(id, updateData) {
    try {
      const { title, author, isbn, cover_image, genres, status } = updateData;
      console.log("Executing update query with data:", {
        id,
        title,
        author,
        isbn,
        cover_image,
        genres,
        status,
      });

      const [result] = await db.execute(
        "UPDATE books SET title = ?, author = ?, isbn = ?, cover_image = ?, genres = ?, status = ? WHERE id = ?",
        [title, author, isbn, cover_image, genres, status, id]
      );
      console.log(
        "SQL Query:",
        "UPDATE books SET title = ?, author = ?, isbn = ?, cover_image = ?, genres = ?, status = ? WHERE id = ?"
      );
      console.log("SQL Parameters:", [
        title,
        author,
        isbn,
        cover_image,
        genres,
        status,
        id,
      ]);
      return result.affectedRows;
    } catch (error) {
      console.error("Error in Book.update:", error);
      throw error;
    }
  }

  static async delete(id) {
    const [result] = await db.execute("DELETE FROM books WHERE id = ?", [id]);
    return result.affectedRows;
  }
}

module.exports = Book;
