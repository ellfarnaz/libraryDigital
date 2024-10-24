const Return = require("../models/return");
const Loan = require("../models/loans");
const Book = require("../models/book");

exports.createReturn = async (req, res) => {
  try {
    const { loanId } = req.body;
    const returnDate = new Date();

    // Check if the loan exists
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Create a new return
    const returnId = await Return.create(loanId, returnDate);

    // Update the loan status to "returned"
    const updatedLoan = await Loan.update(loanId, { status: "returned" });
    if (updatedLoan === 0) {
      throw new Error("Failed to update loan status");
    }

    // Get the book details
    const book = await Book.findById(loan.book_id);
    if (!book) {
      throw new Error("Book not found");
    }

    // Update the book status to "tersedia"
    const updatedBook = await Book.update(loan.book_id, {
      status: "tersedia",
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      cover_image: book.cover_image,
      genres: book.genres,
    });
    if (updatedBook === 0) {
      throw new Error("Failed to update book status");
    }

    res.status(201).json({ message: "Book returned successfully", returnId });
  } catch (error) {
    console.error("Error in createReturn:", error);
    res
      .status(500)
      .json({ message: "Error returning book", error: error.message });
  }
};
