const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchase');
const userAuth = require('../middleware/auth');

router.get('/getStatus' , userAuth.authenticate , purchaseController.getStatus)
router.get('/premiumPurchase', userAuth.authenticate , purchaseController.premiumPurchase)
router.post('/updateTransactionStatus' , userAuth.authenticate , purchaseController.updateTransactionStatus)
router.post('/updateOrderStatus' , userAuth.authenticate , purchaseController.updateOrderStatus)


module.exports = router;
