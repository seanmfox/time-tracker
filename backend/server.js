import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import { getSecret } from './secrets';
import Comment from './models/comment';
import User from './models/user';
import bcrypt from 'bcrypt'

// and create our instances
const app = express();
const router = express.Router();

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;

// db config -- set your URI from mLab in secrets.js
mongoose.connect((app.settings.env === 'development' ? getSecret('dbUri') : process.env.DB_URI), { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// Get a list of users from the database
router.get('/users', (req, res) => {
  User.find((err, users) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, userData: users });
  });
});

// Check if a user is valid by hashing and comparing password
router.post('/usersignin/', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: 'You must provide a username and password'
    });
  }
  User.find({ username: username}, (err, docs) => {
    if (err) return res.json({ success: false, error: err });
    return bcrypt.compare(password, docs[0].password).then((response) => {
      if (!response) return res.json({ success: false, error: 'Incorrect password'})
      return res.json({ success: true, validUser: true, userId: docs[0]._id });  
    })
  })
});

// Create a new user
router.post('/users', (req, res) => {
  const user = new User();
  // body parser lets us use the req.body
  const { username, password } = req.body;
  if (!username || !password) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: 'You must provide a username and password'
    });
  }
  bcrypt.hash(password, 10).then((hash) => {
    user.username = username;
    user.password = hash
    user.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  })
});

// List a user's tracked activities
router.get('/activities/:userId', (req, res) => {
  const { userId } = req.params
  User.findById(userId, (err, user) => {
    if (err) return res.json({ success: false, error: err});
    return res.json({ success: true, activities: user.activities})
  })
})

// Create a new tracked time
router.post('/activities', (req, res) => {
  const { activityType, time, date, userId } = req.body;
  if (!activityType || !time || !date) {
    return res.json({
      success: false,
      error: 'An activity type, date and time must be provided'
    });
  }
  User.findById(userId, (err, user) => {
    if(err) return res.json({ success: false, error: err});
    user.activities.push({ activityType: activityType, time: time, date: date})
    user.save((err) => {
      if (err) return res.json({  success: false, error: err });
      return res.json({ success: true })
    });
  })
})

// Remove an activity
router.delete('/activities/:activityId', (req, res) => {
  const { activityId } = req.params
  const { userId } = req.body
  if (!activityId) {
    return res.json({
      success: false,
      error: 'An activity ID must be provided'
    });
  }
  User.findById(userId, (err, user) => {
    if(err) return res.json({ success: false, error: err});
    user.activities.id(activityId).remove()
    user.save((err) => {
      if (err) return res.json({  success: false, error: err });
      return res.json({ success: true })
    });
  })
})


router.get('/comments', (req, res) => {
  Comment.find((err, comments) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: comments });
  });
});

router.post('/comments', (req, res) => {
  const comment = new Comment();
  // body parser lets us use the req.body
  const { author, text } = req.body;
  if (!author || !text) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: 'You must provide an author and comment'
    });
  }
  comment.author = author;
  comment.text = text;
  comment.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.put('/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    return res.json({ success: false, error: 'No comment id provided' });
  }
  Comment.findById(commentId, (error, comment) => {
    if (error) return res.json({ success: false, error });
    const { author, text } = req.body;
    if (author) comment.author = author;
    if (text) comment.text = text;
    comment.save(error => {
      if (error) return res.json({ success: false, error });
      return res.json({ success: true });
    });
  });
});

router.delete('/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    return res.json({ success: false, error: 'No comment id provided' });
  }
  Comment.remove({ _id: commentId }, (error, comment) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true });
  });
});

// Use our router configuration when we call /api
app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));