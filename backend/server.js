const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const userRoutes = require('./routes/users');
const User = require('./models').User;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {
	loginRequired,
	ensureCorrectUser,
	adminOnlyData
} = require('./middleware/auth');

// and create our instances
require('dotenv').config();
const app = express();
const router = express.Router();
app.use(cookieParser());
const cookieOptions = {
	httpOnly: true,
	secure: true
};

// set our port to either a predetermined port number if you have set it up, or 3001
const PORT = process.env.PORT || 3001;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// Get all user data from the database
app.use('/api/userdata', loginRequired, adminOnlyData);
router.get('/userdata', (req, res) => {
	User.find({ userRole: 'student' }, '-password', (err, users) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, userData: users });
	});
});

// Log in user after checking hashed password
router.post('/usersignin/', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		// we should throw an error. we can do this check on the front end
		return res.json({
			success: false,
			error: 'You must provide a email and password'
		});
	}
	User.findOne({ email: email.toLowerCase() }, (err, doc) => {
		if (!doc)
			return res.json({
				success: false,
				error: 'The email or password do not match.  Please try again.'
			});
		return bcrypt.compare(password, doc.password).then(response => {
			if (!response)
				return res.json({
					success: false,
					error: 'The email or password do not match.  Please try again.'
				});
			res.cookie(
				'JWT',
				jwt.sign(
					{
						userRole: doc.userRole,
						userId: doc._id,
						email: doc.email
					},
					process.env.SECRET_KEY
				),
				cookieOptions
			);
			return res.json({
				success: true,
				validUser: true,
				userRole: doc.userRole,
				userId: doc._id,
				fname: doc.fname,
				lname: doc.lname,
				email: doc.email
			});
		});
	});
});

router.post('/signout', (req, res) => {
	res.clearCookie('JWT');
	return res.json({
		success: true
	});
});

//Authenticate user if already signed in
router.get('/authenticateuser', (req, res) => {
	const token = req.cookies.JWT;
	if (!token) return res.json({ success: false });
	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		User.findById(decoded.userId, (err, user) => {
			if (err) return res.json({ success: false, error: err });
			return res.json({
				success: true,
				validUser: true,
				userRole: user.userRole,
				userId: user._id,
				fname: user.fname,
				lname: user.lname,
				email: user.email
			});
		});
	});
});

// Use our router configuration when we call /api
app.use('/api/users/:userId/activities', loginRequired, ensureCorrectUser);
app.use('/api', router);
app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(`${__dirname}/../client/build`));

	// Handle React routing, return all requests to React app
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../client/build/index.html'));
	});
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
