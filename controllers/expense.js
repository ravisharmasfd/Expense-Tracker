const createExpense = async (req, res) => {
    try {
        const { userId, description, amount, category } = req.body;
      const user = await User.findByPk(userId);
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
      const user = await User.findByPk(req.body.userId);
      const expenses = await user.getExpenses();
      res.json(expenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  module.exports = {
    createExpense,
    getAllExpenseByUser
  }