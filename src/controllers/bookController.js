const Book = require("../models/book");
const fs = require("fs").promises;
const path = require("path");

const UPLOADS_DIR = path.join(__dirname, "..", "..", "src", "uploads");

exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, genres, status } = req.body;
    const coverImage = req.file ? req.file.filename : null;
    const parsedGenres = JSON.parse(genres);

    const bookId = await Book.create(
      title,
      author,
      isbn,
      coverImage,
      parsedGenres,
      status
    );
    res.status(201).json({ message: "Book created successfully", bookId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Pastikan genres dalam format array
    book.genres = book.genres ? JSON.parse(book.genres) : [];

    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res
      .status(500)
      .json({ message: "Error fetching book", error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const result = await Book.delete(req.params.id);
    if (result === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, genres, status } = req.body;
    const newCoverImage = req.file ? req.file.filename : null;

    console.log("Received update data:", {
      id,
      title,
      author,
      isbn,
      genres,
      status,
      newCoverImage,
    });
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const currentBook = await Book.findById(id);
    if (!currentBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    let updateData = {
      title: title || currentBook.title,
      author: author || currentBook.author,
      isbn: isbn || currentBook.isbn,
      genres: genres ? JSON.stringify(JSON.parse(genres)) : currentBook.genres,
      status: status || currentBook.status,
      cover_image: newCoverImage || currentBook.cover_image,
    };

    if (newCoverImage) {
      // Hapus cover image lama jika ada
      if (currentBook.cover_image) {
        const oldCoverPath = path.join(UPLOADS_DIR, currentBook.cover_image);
        try {
          await fs.access(oldCoverPath);
          await fs.unlink(oldCoverPath);
          console.log(`Old cover image deleted: ${oldCoverPath}`);
        } catch (err) {
          if (err.code === "ENOENT") {
            console.log(`Old cover image not found: ${oldCoverPath}`);
          } else {
            console.error("Error deleting old cover image:", err);
          }
          // Lanjutkan proses meskipun gagal menghapus file lama
        }
      }
    }

    console.log("Update data being sent to model:", updateData);

    const result = await Book.update(id, updateData);

    if (result === 0) {
      return res.status(404).json({ message: "Failed to update book" });
    }

    res.json({
      message: "Book updated successfully",
      coverImagePath: newCoverImage
        ? `/uploads/${newCoverImage}`
        : currentBook.cover_image,
    });
  } catch (error) {
    console.error("Detailed error in updateBook:", error);
    res
      .status(500)
      .json({ message: "Error updating book", error: error.toString() });
  }
};
