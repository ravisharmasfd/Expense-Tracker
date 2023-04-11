const express = require('express')
const authRouter = require('./auth.js')
const expenseRouter = require('./expense.js')
const orderRouter  = require('./order.js')
const router = express.Router();

router.use('/auth',authRouter);
router.use('/expense', expenseRouter);
router.use('/order',orderRouter)
module.exports = router;