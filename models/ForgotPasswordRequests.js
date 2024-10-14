const mongoose = require('mongoose');
const { UUID, UUIDV4 } = require('sequelize');

const forgotPasswordSchema = new mongoose.Schema ({
  id: {
        type: UUID,
        primaryKey: true,
        default:UUIDV4,
      },
    isActive: {
      type: Boolean,
        required: true,
        default: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
});

module.exports = mongoose.model("ForgottenPasswords" , forgotPasswordSchema);
