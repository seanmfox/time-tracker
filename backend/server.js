// import express from 'express';
// import bodyParser from 'body-parser';
// import logger from 'morgan';
// import mongoose from 'mongoose';
// import { getSecret } from './secrets';
// import Comment from './models/comment';
// import User from './models/user';
// import bcrypt from 'bcrypt'
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const path = require("path");
const dotenv = require("dotenv");

// and create our instances
require("dotenv").config();
const app = express();
const router = express.Router();

// set our port to either a predetermined port number if you have set it up, or 3001
const PORT = process.env.PORT || 3001;

// db config -- set your URI from mLab in secrets.js
mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// Get a list of users from the database
router.get("/users", (req, res) => {
  User.find({}, "email", (err, users) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, userList: users });
  });
});

// Get all user data from the database
router.get("/userdata", (req, res) => {
  User.find({ userRole: "student" }, "-password", (err, users) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, userData: users });
  });
});

// Log in user after checking hashed password
router.post("/usersignin/", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: "You must provide a email and password"
    });
  }
  User.findOne({ email: email }, (err, doc) => {
    if (!doc)
      return res.json({
        success: false,
        error: "The email or password do not match.  Please try again."
      });
    return bcrypt.compare(password, doc.password).then(response => {
      if (!response)
        return res.json({
          success: false,
          error: "The email or password do not match.  Please try again."
        });
      return res.json({
        success: true,
        validUser: true,
        userRole: doc.userRole,
        userId: doc._id,
        fname: doc.fname,
        lname: doc.lname
      });
    });
  });
});

//Authenticate user if already signed in
router.get("/authenticateuser/:userId", (req, res) => {
  const { userId } = req.params;
  User.findById(userId, (err, user) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, userRole: user.userRole });
  });
});

// Create a new user
router.post("/users", (req, res) => {
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
    user.email = email;
    user.password = hash;
    user.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });
});

// List a user's tracked activities
router.get("/activities/:userId", (req, res) => {
  const { userId } = req.params;
  User.findById(userId, (err, user) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, activities: user.activities });
  });
});

// Create a new tracked time
router.post("/activities", (req, res) => {
  const { activityType, time, date, userId, description } = req.body;
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
});

// Remove an activity
router.delete("/activities/:activityId", (req, res) => {
  const { activityId } = req.params;
  const { userId } = req.body;
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
});

// Use our router configuration when we call /api
app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(`${__dirname}/../client/build`));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
