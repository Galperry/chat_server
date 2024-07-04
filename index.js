const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/message');
const Room = require('./models/room');
require('dotenv').config();

const app = express();
const PORT = 8080;
app.use(express.json());

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then((result) => {
    console.log('connected to db');
  })
  .catch((err) => console.log(err));

const server = app.listen(PORT, () =>
  console.log('listening on http://localhost:8080')
);

const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (receivedMsg) => {
    const userId = receivedMsg.userId;
    const roomId = receivedMsg.roomId;
    const content = receivedMsg.content;

    const message = new Message({
      userId,
      roomId,
      content,
      timestamp: Date.now(),
      isRead: false,
    });

    message
      .save()
      .then((result) => io.emit('message', result))
      .catch((err) => console.log(err));
    //io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });

  socket.on('getMessages', (roomId) => {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      io.emit('getMessages', { isSucceed: false, message: 'Room id invalid' });
    } else {
      Room.findById(roomId).then((doc) => {
        if (doc) {
          Message.find({ roomId })
            .sort({ timestamp: 'asc' })
            .then((msgDocs) => {
              io.emit('getMessages', { isSucceed: true, messages: msgDocs });
            });
        } else {
          io.emit('getMessages', {
            isSucceed: false,
            message: 'Room does not exist',
          });
        }
      });
    }
  });

  socket.on('readMessages', ({ userId, roomId, lastTimestamp }) => {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      io.emit('readMessages', { isSucceed: false, message: 'Room id invalid' });
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
          ).then(() => {
            io.emit('readMessages', {
              isSucceed: true,
              lastTimestamp,
              readingUser: userId,
            });
          });
        } else {
          io.emit('readMessages', {
            isSucceed: false,
            message: 'Room does not exist',
          });
        }
      });
    }
  });
}); // in future - add validations for dataTypes (userId, roomId)

const userRoutes = require('./routes/user');
const roomRoutes = require('./routes/room');

app.use(cors());

app.use('/user', userRoutes);
app.use('/room', roomRoutes);
