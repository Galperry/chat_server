const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  userId: mongoose.Schema.ObjectId,
  roomId: mongoose.Schema.ObjectId,
  content: String,
  timestamp: Number,
  isRead: Boolean,
});

module.exports = mongoose.model('Message', messageSchema);
