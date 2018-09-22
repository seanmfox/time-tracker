const User = require("../models").User;
const bcrypt = require("bcrypt");

exports.getUsers = (req, res) => {
  User.find({}, "email")
  .then((users) => {
    return res.json({ success: true, userList: users });
  })
  .catch((err) => {
    if (err) return res.json({ success: false, error: err });
  })
}

exports.createUser = (req, res) => {
  const user = new User();
  // body parser lets us use the req.body
  const { fname, lname, email, password } = req.body;
  if (!email || !password || !fname || !lname) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: "You must provide a first name, last name, email and password"
    });
  }
  bcrypt.hash(password, 10).then(hash => {
    user.fname = fname;
    user.lname = lname;
    user.email = email.toLowerCase();
    user.password = hash;
    user.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });
}

exports.getActivities = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
  .then((user) => {
    return res.json({ success: true, activities: user.activities });
  })
  .catch((err) => {
    return res.json({ success: false, error: err })
  });
}

exports.createActivity = (req, res) => {
  const { userId } = req.params;
  const { activityType, time, date, description } = req.body;
  if (!activityType || !time || !date || !description) {
    return res.json({
      success: false,
      error: "An activity type, description, date and time must be provided"
    });
  }
  User.findById(userId, (err, user) => {
    if (err) return res.json({ success: false, error: err });
    user.activities.push({
      activityType: activityType,
      time: time,
      date: date,
      description: description
    });
    user.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });
}

exports.deleteActivity = (req, res) => {
  const { activityId, userId } = req.params;
  if (!activityId) {
    return res.json({
      success: false,
      error: "An activity ID must be provided"
    });
  }
  User.findById(userId, (err, user) => {
    if (err) return res.json({ success: false, error: err });
    user.activities.id(activityId).remove();
    user.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });
}

module.exports = exports;