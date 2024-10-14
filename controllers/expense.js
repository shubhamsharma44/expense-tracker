const Expense = require('../models/expense');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.getExpense = async (req, res) => {
    const { pageSize = 5 ,page = 1 } = req.query ;  

    try {
        const expenses = await Expense.find({ userId: req.user._id })
                                            .limit(parseInt(pageSize))
                                            .skip((page - 1) * parseInt(pageSize));
        const totalItems = await Expense.countDocuments({ userId:req.user._id });
        res.status(200).json({
            expenses,
            currentPage: parseInt(page),
            totalItems,
            totalPages: Math.ceil(totalItems / parseInt(pageSize)),
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
}

exports.postExpense = async (req, res) => {

    const { amount, description, category } = req.body;
    try {
        const expense = new Expense({
            amount, 
            description, 
            category, 
            userId: req.user._id 
        });
        await expense.save();

        const total = parseFloat(req.user.totalCost) + parseFloat(amount);

        req.user.totalCost = total;
        await req.user.save();

        res.status(201).json({ expense, success: true });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({success:false, error: 'Failed to create expense' });
    }
}

exports.deleteExpense = async (req, res) => {
    const expenseId = req.params.expenseId;
    
    try { 
        const currentExpense = await Expense.findOne({_id:expenseId , userId:req.user._id});
        if (!currentExpense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }
        await Expense.deleteOne({_id:expenseId , userId:req.user._id});
        
        req.user.totalCost -= currentExpense.amount;
        await req.user.save();
        res.status(200).json({success:true,message:"Deleted succesfully"});
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
}
