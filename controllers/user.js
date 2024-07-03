const User = require('../models/user');
var mongoose = require('mongoose');

exports.userList = (req, res, next) => {
  User.find({}).then((doc) => {
    res.send(doc);
  }); // future improvment: map it to a prettier/more secure set of data (e.g. omit passwords)
};

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.send({ isSucceed: false, message: 'User id invalid' });
  } else {
    User.findById(userId).then((doc) => {
      if (doc) {
        res.send({ isSucceed: true, user: doc });
      } else {
        res.send({ isSucceed: false, message: 'User does not exist' });
      }
    });
  }
};

exports.addUser = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = new User({ username, password });

  User.exists({ username }).then((doc) => {
    if (doc) {
      res.send('Username already exists in the system');
    } else {
      user
        .save()
        .then((result) => res.send(result))
        .catch((err) => console.log(err));
    }
  });
}; // future improvement: encrypt passwords using a designated library (also relevant to login if done)

exports.deleteUser = (req, res, next) => {
  const username = req.params.username;
  User.findOneAndDelete({ username }).then((doc) => {
    if (doc) {
      res.send({
        isSucceed: true,
        message: `The user "${doc.username}" has been successfully deleted`,
      });
    } else {
      res.send({ isSucceed: false, message: 'User does not exist' });
    }
  });
}; // another suggestion: keep the data in the DB but add a "disabled" state that won't allow logging in

exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username, password }).then((doc) => {
    if (doc) {
      res.send({ isSucceed: true });
    } else {
      res.send({ isSucceed: false, message: 'Invalid username or password' });
    }
  }); // future suggestion: count retries for wrong password guesses (and potentially block)
};
