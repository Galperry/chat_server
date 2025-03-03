const Room = require('../models/room');

exports.getRoomList = (req, res, next) => {
  Room.find({}).then((doc) => {
    res.send({ isSucceed: true, roomList: doc });
  });
};

// these two are now implemented with socket.io

// exports.getRoomMessages = (req, res, next) => {
//   const roomId = req.params.roomId;
//   if (!mongoose.Types.ObjectId.isValid(roomId)) {
//     res.send({ isSucceed: false, message: 'Room id invalid' });
//   } else {
//     Room.findById(roomId).then((doc) => {
//       if (doc) {
//         Message.find({ roomId })
//           .sort({ timestamp: 'asc' })
//           .then((msgDocs) => {
//             res.send({ isSucceed: true, messages: msgDocs });
//           });
//       } else {
//         res.send({ isSucceed: false, message: 'Room does not exist' });
//       }
//     });
//   }
// }; // can reuse parts of it when updating read messages

// exports.setReadMessages = (req, res, next) => {
//   const userId = req.body.userId;
//   const roomId = req.body.roomId;
//   const lastTimestamp = req.body.timestamp;

//   if (!mongoose.Types.ObjectId.isValid(roomId)) {
//     res.send({ isSucceed: false, message: 'Room id invalid' });
//   } else {
//     Room.findById(roomId).then((doc) => {
//       if (doc) {
//         Message.updateMany(
//           {
//             roomId,
//             userId: { $ne: userId },
//             timestamp: { $lte: lastTimestamp },
//             isRead: false,
//           },
//           { isRead: true }
//         ).then((msgDocs) => {
//           console.log('msgdocs', msgDocs);
//           res.send({ isSucceed: true });
//         });
//       } else {
//         res.send({ isSucceed: false, message: 'Room does not exist' });
//       }
//     });
//   }
// };
