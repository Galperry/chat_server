const express = require('express');

const roomController = require('../controllers/room');

const router = express.Router();

// /rooms/roomList => GET
router.get('/roomList', roomController.getRoomList);

// // /rooms/getRoomMessages => GET
router.get('/getRoomMessages/:roomId', roomController.getRoomMessages);

// /rooms/addMessage => POST
router.post('/addMessage', roomController.addMessage);

// /rooms/readMessages => POST
router.post('/readMessages', roomController.setReadMessages);

// add room, delete room APIs if time allows it

module.exports = router;
