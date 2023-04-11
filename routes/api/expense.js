const express = require('express');
const User = require('../../models/user');
const Expense = require('../../models/expense');
const { createExpense, getAllExpenseByUser } = require('../../controllers/expense');
const router = express.Router();
router.post('/', createExpense );
  
  // Define a route to get all expenses for a user
  router.get('/', getAllExpenseByUser);
  module.exports = router