const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema ({
    id: {
        type: String,
        required: true,
     },
     paymentId: {
      type:String,
    },
     orderId: {
       type: String,
       required: true,
     },
     status: {
       type: String,
       required: true,
     },
     userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true,
     },
});

module.exports = mongoose.model("order" , ordersSchema);
