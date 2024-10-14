const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema ({
      amount: {
        type: Number,
        required: true,
        default:0
      },
      description: {
        type: String,
        required: true,
    },
    category: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    }
})
module.exports=mongoose.model("Expense" , expenseSchema);