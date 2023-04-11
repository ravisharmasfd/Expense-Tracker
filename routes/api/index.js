const express = require('express')
const authRouter = require('./auth.js')
const expenseRouter = require('./expense.js')
const router = express.Router();

router.use('/auth',authRouter);
router.use('/expense', expenseRouter)
module.exports = router;