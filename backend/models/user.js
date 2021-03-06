const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const Activity = new Schema({
  activityType: String,
  time: Number,
  date: Date,
  description: String
});

const UserSchema = new Schema(
  {
    fname: String,
    lname: String,
    email: String,
    password: String,
    activities: [Activity],
    userRole: { type: String, default: "student" }
  },
  { timestamps: true }
);

// export our module to use in server.js
module.exports = mongoose.model("User", UserSchema);
