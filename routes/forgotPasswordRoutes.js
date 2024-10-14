const express = require('express');
const router = express.Router();

const passwordController = require('../controllers/forgotPassword');

router.post('/forgotpassword' ,  passwordController.forgotpassword)
router.get('/resetPassword/:id' , passwordController.resetPassword);
router.get('/updatePassword/:id' , passwordController.updatePassword)

module.exports=router;