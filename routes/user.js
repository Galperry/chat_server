const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

// /user/userList => GET
router.get('/userList', userController.userList);

// /user/:username => GET
router.get('/:userId', userController.getUser);

// /user/addUser => POST
router.post('/addUser', userController.addUser);

// /user/:username => DELETE
router.delete('/:username', userController.deleteUser);

// /user/login => POST
router.post('/login', userController.login);

module.exports = router;
