const Razorpay = require('razorpay');
const Order = require('../models/purchase');
const User = require('../models/user'); 

exports.getStatus = async( req , res) => {
    try{
        const isPremiumUser = req.user.isPremiumUser;
        res.status(200).json({ status:isPremiumUser });
    }catch(error){
        console.error('Error in transaction status' , error);
        res.status(500).json({error:error,message:"An error encountering"})
    }
}

exports.premiumPurchase = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 2500;

        const order = await rzp.orders.create({ amount, currency: 'INR' });
        const newOrder = new Order({
            id: order.id,
            orderId: order.id,
            status: "PENDING",
            userId: req.user._id,
        });
        await newOrder.save();

        return res.status(201).json({ order, key_id: rzp.key_id });
    } catch (error) {
        console.error('Error in premium purchase:', error);
        res.status(500).json({ message: 'Something went wrong', error: error });
    }
};

exports.updateOrderStatus= async ( req, res) => {
    try{
        const{ order_id } = req.body;
        const order = await Order.findOne({orderId:order_id});
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        };
        
        order.status = 'FAILED';
        await order.save();
        res.status(200).json({success:true,message:'Order status updated FAILED'})
    }catch(error){
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status', error: error });
    }
}

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;

        const order = await Order.findOne({ orderId: order_id });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        };

        order.paymentId = payment_id;
        order.status = 'SUCCESSFUL';
        req.user.isPremiumUser = true;

        await Promise.all([order.save(), req.user.save()]);

        res.status(202).json({ success: true, message: "Transaction successful" });
    } catch (error) {
        console.error('Error updating transaction status:', error);
        res.status(500).json({ error: error, message: "Something went wrong" });
    }
};
