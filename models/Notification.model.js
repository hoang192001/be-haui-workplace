const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    body: String,
    from: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    type: String,
    link: String,
    viewStatus: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
