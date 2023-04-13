const s3 = require("../config/bucket");
const { s3Bucket } = require("../config/env");
const sequelize = require("../database");
const Expense = require("../models/expense");
const File = require("../models/files");
const User = require("../models/user");
const { Op } = require('sequelize');
const createExpense = async (req, res) => {
  try {
    const user = req.user;
    const trans = await sequelize.transaction()
    const { description, amount, category } = req.body;
    if (!description || !amount || !category)
      res.status(400).json({ message: "check your data" });
    const expense = await Expense.create({
      description: req.body.description,
      category: req.body.category,
      amount: req.body.amount,
    },{ transaction: trans });
    user.totalExpense += amount;
    await user.addExpense(expense,{transaction:trans});
    await user.save({transaction:trans});
    await trans.commit();
    res.json(expense);
  } catch (error) {
    console.error(error);
    trans.rollback();
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllExpenseByUser = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    res.json({
      expenses,
      user: {
        name: req.user.name,
        premium: req.user.premium,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteExpense = async (req, res) => {
  try {
    const trans = await sequelize.transaction();
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    // Check if the expense belongs to the user who made the request
    if (expense.UserId !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user.totalExpense -= expense.amount;
    await expense.destroy({transaction:trans});
    await req.user.save({transaction:trans});
    await trans.commit();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    trans.rollback();
    res.status(500).json({ error: "Internal server error" });
  }
};

// const updateExpense = async (req, res) => {
//   try {
//     const expense = await Expense.findByPk(req.params.id);
//     if (!expense) {
//       return res.status(404).json({ error: "Expense not found" });
//     }
//     // Check if the expense belongs to the user who made the request
//     if (expense.UserId !== req.user.id) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//     const { description, category, amount } = req.body;
//     await expense.update({ description, category, amount });
//     res.json(expense);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
const leaderBoard = async (req, res) => {
  try {
    if (!req.user.premium) {
      res.status(401).json({ message: "your are not a premium member" });
      return;
    }

    const usersWithExpenses = await User.findAll({
      attributes: [
        "id",
        "email",
        "name",
        'totalExpense'
      ],
      order: sequelize.literal("totalExpense DESC"),
    });
    res.json(usersWithExpenses);
  } catch (error) {
    console.log(error)
    res.status(500);
  }
};
const report = async(req,res)=>{
  const user = req.user
  if(!user.premium){
    res.status(401).json({message:"You are not a premium member"});
    return;
  }
  const timeframe = req.body.timeframe;
  
  let startDate;
  const currentDate = new Date();
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() );
  
  switch (timeframe) {
    case 'daily':
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1);
      break;
    case 'weekly':
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()-7);
      break;
    case 'monthly':
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() -1,  currentDate.getDate());
      break;
    case 'yearly':
      startDate = new Date(currentDate.getFullYear()-1,currentDate.getMonth(),currentDate.getDate() );
      break;
    default:
      res.status(400).json({ error: 'Invalid timeframe' });
      return;
  }

  try {
    const expenses = await Expense.findAll({
      where: {
        userId: user.id,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    });
    
    let totalExpense = 0;
    expenses.forEach(expense => {
      totalExpense += expense.amount;
    });
    
    res.json({
      user: user,
      expenses: expenses,
      totalExpense: totalExpense
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const downloadReport  = async(req,res)=>{
  try {
    const expenses = await req.user.getExpenses();
      const records = expenses.map(expense => ({
        description: expense.description,
        category: expense.category,
        amount: expense.amount,
      }));

      const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
      const params = {
        Bucket: s3Bucket,
        Key: `expenses-${req.user.id}-${now}.txt`,
        Body: JSON.stringify(records),
        ACL: "public-read"
      };
      const uploadPromise = s3.upload(params).promise();
      const { Location } = await uploadPromise;
      const file = await req.user.createFile({
        url:Location,
        name:params.Key
      })
    
      res.send({ url: Location , file});
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
const previousFiles =async(req,res)=>{
   try {
    const files = await File.findAll({where:{UserId:req.user.id},
      order: sequelize.literal("createdAt DESC")})
    res.json(files)
   } catch (error) {
    res.status(500)
    console.log(error)

   }
}
module.exports = {
  createExpense,
  getAllExpenseByUser,
  deleteExpense,
  // updateExpense,
  leaderBoard,
  report,
  downloadReport,
  previousFiles
};
