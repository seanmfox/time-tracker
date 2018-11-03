const User = require("../models").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUsers = (req, res) => {
  User.find({}, "email")
    .then(users => {
      return res.json({ success: true, userList: users });
    })
    .catch(err => {
      if (err) return res.json({ success: false, error: err });
    });
};

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
};

exports.updateUser = (req, res) => {
  const { userId } = req.params;

  // body parser lets us use the req.body
  const { fname, lname, email, newPassword } = req.body;
  if (!email || !fname || !lname) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: "You must provide a first name, last name, and email"
    });
  }
  if (newPassword) {
    bcrypt.hash(newPassword, 10).then(hash => {
      User.findById(userId, (error, user) => {
        user.fname = fname;
        user.lname = lname;
        user.email = email.toLowerCase();
        user.password = hash;
        user.save((err, updatedUser) => {
          if (err) return res.json({ success: false, error: err });
          return res.json({
            token: jwt.sign(
              {
                success: true,
                validUser: true,
                userRole: updatedUser.userRole,
                userId: updatedUser._id,
                fname: updatedUser.fname,
                lname: updatedUser.lname,
                email: updatedUser.email
              },
              process.env.SECRET_KEY
            ),
            user: {
            success: true,
            validUser: true,
            userRole: updatedUser.userRole,
            userId: updatedUser._id,
            fname: updatedUser.fname,
            lname: updatedUser.lname,
            email: updatedUser.email
            }
          });
        });
      });
    });
  } else {
    User.findById(userId, (error, user) => {
      user.fname = fname;
      user.lname = lname;
      user.email = email.toLowerCase();
      user.save((err, updatedUser) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({
          token: jwt.sign(
            {
              success: true,
              validUser: true,
              userRole: updatedUser.userRole,
              userId: updatedUser._id,
              fname: updatedUser.fname,
              lname: updatedUser.lname,
              email: updatedUser.email
            },
            process.env.SECRET_KEY
          ),
          user: {
            success: true,
            validUser: true,
            userRole: updatedUser.userRole,
            userId: updatedUser._id,
            fname: updatedUser.fname,
            lname: updatedUser.lname,
            email: updatedUser.email
            }
        });
      });
    });
  }
};

exports.resetPassword = (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;
  if (!password) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: "You must provide a new password"
    });
  }
  bcrypt.hash(password, 10).then(hash => {
    User.findById(userId, (error, user) => {
      user.password = hash;
      user.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true })
      })
    })
  })
}

exports.getActivities = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then(user => {
      return res.json({ success: true, activities: user.activities });
    })
    .catch(err => {
      return res.json({ success: false, error: err });
    });
};

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
};

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
};

module.exports = exports;
