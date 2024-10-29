// loanController.js
const Loan = require("../models/loans");
const Book = require("../models/book");
const Return = require("../models/return");

exports.createLoan = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;
    const loanDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(loanDate.getDate() + 7);
    dueDate.setHours(23, 59, 59, 999); // Atur waktu hingga 23:59:59.999

    const book = await Book.findById(bookId);
    if (!book || book.status !== "tersedia") {
      return res
        .status(400)
        .json({ message: "Book is not available for loan" });
    }

    const loanId = await Loan.create(userId, bookId, loanDate, dueDate);

    await Book.update(bookId, {
      status: "loaned",
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      cover_image: book.cover_image,
      genres: book.genres,
    });

    console.log("Book borrowed successfully. Loan ID:", loanId);
    res.status(201).json({ message: "Book borrowed successfully", loanId });
  } catch (error) {
    console.error("Error borrowing book:", error);
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
        title: loan.book_title,
        author: loan.book_author,
        genres: JSON.parse(loan.book_genres),
        cover_image: loan.book_cover_image,
      },
      user: {
        username: loan.username,
      },
      loan_date: loan.loan_date,
      due_date: loan.due_date,
      return_date: loan.return_date,
      status: loan.status,
    }));

    console.log("User loans:", formattedLoans);
    res.json(formattedLoans);
  } catch (error) {
    console.error("Error fetching user loans:", error);
    res
      .status(500)
      .json({ message: "Error fetching user loans", error: error.message });
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    const loanId = req.params.loanId;
    console.log("Received delete request for loan ID:", loanId);

    await Return.deleteByLoanId(loanId);

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

// loanController.js
// loanController.js
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll();
    res.json(loans);
  } catch (error) {
    console.error("Error fetching all loans:", error);
    res
      .status(500)
      .json({ message: "Error fetching all loans", error: error.message });
  }
};
// loanController.js
exports.getLoanCount = async (req, res) => {
  try {
    const { status } = req.query;
    const count = await Loan.countByStatus(status);
    res.json({ count });
  } catch (error) {
    console.error("Error fetching loan count:", error);
    res
      .status(500)
      .json({ message: "Error fetching loan count", error: error.message });
  }
};
// loanController.js

exports.getMonthlyLoanData = async (req, res) => {
  try {
    const monthlyData = await Loan.getMonthlyLoanData();
    const formattedData = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    monthlyData.forEach((item) => {
      const monthAbbr = new Date(item.month).toLocaleString("default", {
        month: "short",
      });
      formattedData[monthAbbr] = item.count;
    });

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching monthly loan data:", error);
    res.status(500).json({
      message: "Error fetching monthly loan data",
      error: error.message,
    });
  }
};
exports.getLoanDetails = async (req, res) => {
  try {
    const loanId = parseInt(req.params.id, 10);
    console.log("Fetching loan details for ID:", loanId);

    const loan = await Loan.findById(loanId);
    console.log(
      "Raw loan data in getLoanDetails:",
      JSON.stringify(loan, null, 2)
    );

    if (!loan) {
      console.log("Loan not found for ID:", loanId);
      return res.status(404).json({ message: "Loan not found" });
    }

    // Format the response
    const formattedLoan = {
      id: loan.id,
      book: {
        title: loan.book_title || "Unknown Title",
        author: loan.book_author || "Unknown Author",
        genres: loan.book_genres ? JSON.parse(loan.book_genres) : [],
        cover_image: loan.book_cover_image || null,
      },
      user: {
        username: loan.username || "Unknown User",
      },
      loan_date: loan.loan_date,
      due_date: loan.due_date,
      status: loan.status,
    };

    console.log(
      "Formatted loan details in getLoanDetails:",
      JSON.stringify(formattedLoan, null, 2)
    );
    res.json(formattedLoan);
  } catch (error) {
    console.error("Error fetching loan details:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.toString() });
  }
};
