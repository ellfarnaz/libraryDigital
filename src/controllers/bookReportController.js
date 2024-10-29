const BookReport = require("../models/BookReport");
const User = require("../models/user");
const Book = require("../models/book");

exports.createReport = async (req, res) => {
  try {
    const {
      reportType,
      description,
      bookTitle,
      requestedTitle,
      requestedGenre,
      reason,
      nama,
      nis,
    } = req.body;
    const userId = req.user.id;

    const reportId = await BookReport.create(
      userId,
      reportType,
      description,
      bookTitle || null,
      requestedTitle || null,
      requestedGenre || null,
      reason || null,
      nama || null,
      nis || null
    );

    res.status(201).json({ message: "Laporan berhasil dibuat", reportId });
  } catch (error) {
    console.error("Error in createReport:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat membuat laporan",
      error: error.message,
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await BookReport.findAll();
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error in getAllReports:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil laporan",
      error: error.message,
    });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await BookReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error("Error in getReportById:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil laporan",
      error: error.message,
    });
  }
};

exports.getReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await BookReport.findByUserId(userId);
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error in getReportsByUser:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil laporan pengguna",
      error: error.message,
    });
  }
};

exports.getReportsByType = async (req, res) => {
  try {
    const { reportType } = req.params;
    const reports = await BookReport.getReportsByType(reportType);
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error in getReportsByType:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil laporan berdasarkan jenis",
      error: error.message,
    });
  }
};
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Periksa apakah status ada dalam updateData
    if (updateData.status) {
      // Validasi nilai status
      const allowedStatuses = ["pending", "processed", "resolved"];
      if (!allowedStatuses.includes(updateData.status)) {
        return res.status(400).json({ message: "Status tidak valid" });
      }
    }

    const affectedRows = await BookReport.update(id, updateData);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }
    res.status(200).json({ message: "Laporan berhasil diperbarui" });
  } catch (error) {
    console.error("Error in updateReport:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat memperbarui laporan",
      error: error.message,
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await BookReport.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }
    res.status(200).json({ message: "Laporan berhasil dihapus" });
  } catch (error) {
    console.error("Error in deleteReport:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat menghapus laporan",
      error: error.message,
    });
  }
};

exports.processReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const report = await BookReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    const updateData = {
      status,
      resolution_notes: resolutionNotes,
      resolution_date: new Date(),
    };

    const affectedRows = await BookReport.update(id, updateData);
    if (affectedRows === 0) {
      return res.status(500).json({ message: "Gagal memproses laporan" });
    }

    res.status(200).json({ message: "Laporan berhasil diproses" });
  } catch (error) {
    console.error("Error in processReport:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat memproses laporan",
      error: error.message,
    });
  }
};
