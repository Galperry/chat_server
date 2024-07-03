const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/message');

const app = express();
const PORT = 8080;
const dbUri =
  'mongodb+srv://yamitoboushi:IVh1r2DKHZBE1DRg@chatappdb.xwpgxk7.mongodb.net/Chat?appName=ChatAppDB';
app.use(express.json());

mongoose
  .connect(dbUri)
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
}); // in future - add validations for dataTypes (userId, roomId)

const userRoutes = require('./routes/user');
const roomRoutes = require('./routes/room');

app.use(cors());

app.use('/user', userRoutes);
app.use('/room', roomRoutes);
