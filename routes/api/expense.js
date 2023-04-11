const express = require('express');
const { createExpense, getAllExpenseByUser, deleteExpense } = require('../../controllers/expense');
const authMiddleWare = require('../../middleware/auth');
const router = express.Router();
router.post('/',authMiddleWare, createExpense );
router.delete('/:id',authMiddleWare,deleteExpense)
  // Define a route to get all expenses for a user
  router.get('/',authMiddleWare, getAllExpenseByUser);
  module.exports = router