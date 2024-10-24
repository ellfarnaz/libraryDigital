const express = require("express");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./src/routes/auth");
const bookRoutes = require("./src/routes/books");
const userRoutes = require("./src/routes/users");
const adminRoutes = require("./src/routes/admin");
const loanRoutes = require("./src/routes/loans");
const returnRoutes = require("./src/routes/returns");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));
app.use(
  "/uploads/profiles",
  express.static(path.join(__dirname, "src/uploads/profiles"))
);

app.use("/api/loans", loanRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use(
  "/api/uploads",
  (req, res, next) => {
    console.log("Requested image:", req.url);
    next();
  },
  express.static(path.join(__dirname, "src", "uploads"))
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
