const express = require('express');

const roomController = require('../controllers/room');

const router = express.Router();

// /room/roomList => GET
router.get('/roomList', roomController.getRoomList);

//these two calls are now implemented with socket.io
// // // /room/getRoomMessages => GET
// router.get('/getRoomMessages/:roomId', roomController.getRoomMessages);

// // /room/readMessages => POST
// router.post('/readMessages', roomController.setReadMessages);

// add room, delete room APIs if time allows it

module.exports = router;
