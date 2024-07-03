const Message = require('../models/message');
const Room = require('../models/room');
var mongoose = require('mongoose');

exports.getRoomList = (req, res, next) => {
  Room.find({}).then((doc) => {
    res.send(doc);
  });
};

exports.getRoomMessages = (req, res, next) => {
  const roomId = req.params.roomId;
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    res.send({ isSucceed: false, message: 'Room id invalid' });
  } else {
    Room.findById(roomId).then((doc) => {
      if (doc) {
        Message.find({ roomId }).then((msgDocs) => {
          res.send({ isSucceed: true, messages: msgDocs });
        });
      } else {
        res.send({ isSucceed: false, message: 'Room does not exist' });
      }
    });
  }
}; // can reuse parts of it when updating read messages

exports.addMessage = (req, res, next) => {
  const userId = req.body.userId;
  const roomId = req.body.roomId;
  const content = req.body.content;
  const message = new Message({
    userId,
    roomId,
    content,
    timestamp: Date.now(),
    isRead: false,
  });

  message
    .save()
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
}; // in future - add validations for dataTypes (userId)

exports.setReadMessages = (req, res, next) => {
  const userId = req.body.userId;
  const roomId = req.body.roomId;
  const lastTimestamp = req.body.timestamp;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    res.send({ isSucceed: false, message: 'Room id invalid' });
  } else {
    Room.findById(roomId).then((doc) => {
      if (doc) {
        Message.updateMany(
          {
            roomId,
            userId: { $ne: userId },
            timestamp: { $lte: lastTimestamp },
            isRead: false,
          },
          { isRead: true }
        ).then((msgDocs) => {
          console.log('msgdocs', msgDocs);
          res.send({ isSucceed: true });
        });
      } else {
        res.send({ isSucceed: false, message: 'Room does not exist' });
      }
    });
  }
};
