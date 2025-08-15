const Expense = require('../models/Expense');

// Create new expense
exports.createExpense = async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get financial summary
exports.getSummary = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const summary = {
      income: result.find(r => r._id === 'Income')?.total || 0,
      expense: result.find(r => r._id === 'Expense')?.total || 0
    };
    summary.balance = summary.income - summary.expense;
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};