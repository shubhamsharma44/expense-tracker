const User = require('../models/user');
const Expense = require('../models/expense');
const S3services = require('../services/S3services');
const DownloadedFiles = require('../models/downloadedFiles');
const mongoose = require('mongoose');

exports.showLeaderBoard = async (req, res) => {
    try{
        const isPremiumUser = req.user.isPremiumUser;
        if(isPremiumUser){
            const users = await User.find({}, 'name totalCost');
            res.status(200).json(users);
        }else{
            res.status(401).json({success:false , message: "Unauthorized : you are not a premium user"})
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    };
};



exports.downloadRecords = async (req,res ) => {
    try{
        const isPremiumUser = req.user.isPremiumUser;
        if(isPremiumUser){
            const downloadRecoards = await DownloadedFiles.find({userId:req.user._id});
            res.status(201).json(downloadRecoards)
        }else{
            res.status(401).json({success:false , message: "Unauthorized : you are not a premium user"})
        }
    }catch(err) {
        console.error('Error fetching:', err);
        res.status(500).json({ error: 'Failed to fetch' ,err:err});
    };
}


exports.downloadExpense = async(req,res) => {
    try{
        const isPremiumUser = req.user.isPremiumUser;
        if(isPremiumUser){
            const expenses =  await Expense.find({ userId : req.user._id });
            const stringifiedExpenses = JSON.stringify(expenses);
            
            const filename = `Expense${req.user.id}/${new Date().toISOString()}.txt`;
            const fileURL = await S3services.uploadToS3(stringifiedExpenses , filename );
           
            await DownloadedFiles.create({url:fileURL.Location , userId:req.user._id})

            res.status(200).json(fileURL);
        }else{
            res.status(401).json({success:false , message: "Unauthorized : you are not a premium user"})
        }
    }catch(err){
        console.log('Error fetching:',err)
        res.status(500).json({fileURL: '' , error:'Failed to fetch',success:false ,err:err})
    }
}