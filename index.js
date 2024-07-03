const express = require('express');
const mongoose = require('mongoose');
const url = require('url');

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

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });
});

const userRoutes = require('./routes/user');
const roomRoutes = require('./routes/room');

app.use('/user', userRoutes);
app.use('/room', roomRoutes);
