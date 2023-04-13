const express = require("express");
const {
  createExpense,
  getAllExpenseByUser,
  deleteExpense,
  leaderBoard,
  report,
  downloadReport,
  previousFiles,
} = require("../../controllers/expense");
const authMiddleWare = require("../../middleware/auth");
const premiumMiddleWare = require("../../middleware/premium");

const router = express.Router();
router.get("/download-report", premiumMiddleWare, downloadReport);
router.get("/download-previous", premiumMiddleWare, previousFiles);

router.get("/leader", premiumMiddleWare, leaderBoard);
router.post("/report", premiumMiddleWare, report);
router.post("/", authMiddleWare, createExpense);
router.delete("/:id", authMiddleWare, deleteExpense);
router.get("/:page", authMiddleWare, getAllExpenseByUser);
module.exports = router;
