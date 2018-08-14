const express = require("express");
const router = express.Router();
const userHelpers = require("../helpers/users");

router.route('/')
  .get(userHelpers.getUsers)
  .post(userHelpers.createUser);

// List a user's tracked activities

router.route('/:userId/activities')
  .get(userHelpers.getActivities)
  .post(userHelpers.createActivity);

// Remove an activity
router.delete("/:userId/activities/:activityId", userHelpers.deleteActivity);

module.exports = router;