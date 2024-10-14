const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premium');
const userAuth = require('../middleware/auth');

router.get('/showLeaderBoard' , userAuth.authenticate, premiumController.showLeaderBoard)
router.get('/download' , userAuth.authenticate , premiumController.downloadExpense);
router.get('/downloadRecords' , userAuth.authenticate , premiumController.downloadRecords);

module.exports=router;