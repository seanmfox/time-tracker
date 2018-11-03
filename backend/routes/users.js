const express = require("express");
const router = express.Router();
const userHelpers = require("../helpers/users");
const { loginRequired, ensureCorrectUser, adminOnlyData } = require('../middleware/auth')

router.route('/')
  .get(userHelpers.getUsers)
  .post(userHelpers.createUser);

router.route('/:userId').patch(loginRequired, ensureCorrectUser, userHelpers.updateUser);

router.route('/:userId/resetpassword').patch(adminOnlyData, userHelpers.resetPassword);

// List a user's tracked activities
router.route('/:userId/activities')
  .get(userHelpers.getActivities)
  .post(userHelpers.createActivity);

// Remove an activity
router.delete("/:userId/activities/:activityId", userHelpers.deleteActivity);

module.exports = router;