const Loan = require("../models/loans");
const Book = require("../models/book");
const Return = require("../models/return");

exports.createLoan = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;
    const loanDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(loanDate.getDate() + 7); // Set due date to 7 days from loan date

    // Check if the book is available
    const book = await Book.findById(bookId);
    if (!book || book.status !== "tersedia") {
      return res
        .status(400)
        .json({ message: "Book is not available for loan" });
    }

    // Create a new loan
    const loanId = await Loan.create(userId, bookId, loanDate, dueDate);

    // Update the book status to "loaned"
    // Update the book status to "loaned"
    await Book.update(bookId, {
      status: "loaned",
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      cover_image: book.cover_image,
      genres: book.genres,
    });
    res.status(201).json({ message: "Book borrowed successfully", loanId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error borrowing book", error: error.message });
  }
};

exports.getUserLoans = async (req, res) => {
  try {
    const userId = req.user.id;
    const loans = await Loan.findByUserId(userId);
    const formattedLoans = loans.map((loan) => ({
      id: loan.id,
      book: {
        title: loan.title,
        author: loan.author,
        genres: JSON.parse(loan.genres),
        cover_image: loan.cover_image, // Pastikan cover_image disertakan dalam hasil query
      },
      user: {
        username: loan.username,
      },
      loan_date: loan.loan_date,
      due_date: loan.due_date,
      return_date: loan.return_date,
      status: loan.status,
    }));
    res.json(formattedLoans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user loans", error: error.message });
  }
};
exports.deleteLoan = async (req, res) => {
  try {
    const loanId = req.params.loanId;
    console.log("Received delete request for loan ID:", loanId);

    // Hapus baris terkait dalam tabel returns
    await Return.deleteByLoanId(loanId);

    // Hapus peminjaman dari tabel loans
    const deletedLoan = await Loan.delete(loanId);
    console.log("Deleted loan:", deletedLoan);

    if (deletedLoan === 0) {
      console.log("Loan not found");
      return res.status(404).json({ message: "Loan not found" });
    }

    res.json({ message: "Loan deleted successfully" });
  } catch (error) {
    console.error("Error deleting loan:", error);
    res
      .status(500)
      .json({ message: "Error deleting loan", error: error.message });
  }
};
