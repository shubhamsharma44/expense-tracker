const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema ({
    url: {
        type: String,
        required: true,
      },
      downloadedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
});

module.exports = mongoose.model("download" , downloadSchema);
  