const sequelize = require("../database");
const Expense = require("../models/expense");
const User = require("../models/user");

const createExpense = async (req, res) => {
    try {
      const user = req.user;
        const {description, amount, category } = req.body;
        if(!description || ! amount || ! category)  res.status(400).json({message:"check your data"})
      const expense = await Expense.create({
        description: req.body.description,
        category: req.body.category,
        amount: req.body.amount
      });
      await user.addExpense(expense);
      res.json(expense);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } 
const getAllExpenseByUser =  async (req, res) => {
    try {
      const expenses = await req.user.getExpenses();
      res.json({expenses,user:{
        name: req.user.name,
        premium : req.user.premium,
        email : req.user.email,
      }});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  const deleteExpense = async (req, res) => {
    try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
    }
    // Check if the expense belongs to the user who made the request
    if (expense.UserId !== req.user.id) {

    return res.status(401).json({ error: 'Unauthorized' });
    }
    await expense.destroy();

    res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    }
    }
    
    const updateExpense = async (req, res) => {
    try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
    }
    // Check if the expense belongs to the user who made the request
    if (expense.UserId !== req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
    }
    const { description, category, amount } = req.body;
    await expense.update({ description, category, amount });
    res.json(expense);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    }
    }
    const leaderBoard = async(req,res)=>{
      try {
       if(!req.user.premium){
         res.status(401).json({message: 'your are not a premium member'});
         return
       }
     
       const usersWithExpenses = await User.findAll({
         attributes: [
           'id',
           'email',
           'name',
           'premium',
           [sequelize.fn('SUM', sequelize.col('Expenses.amount')), 'totalExpense']
         ],
         include: [{
           model: Expense,
           attributes: []
         }],
         group: ['User.id'],
         order: sequelize.literal('totalExpense ASC')
       });
       res.json(usersWithExpenses)
      } catch (error) {
       res.status(500)
      }
     }
    
  module.exports = {
    createExpense,
    getAllExpenseByUser,
    deleteExpense,
    updateExpense,
    leaderBoard
  }