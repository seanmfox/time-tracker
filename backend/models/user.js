const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const Activity = new Schema({ activityType: String, time: Number, date: Date, description: String });

const UsersSchema = new Schema({
  username: String,
  password: String,
  activities: [Activity]
}, { timestamps: true });

// export our module to use in server.js
module.exports = mongoose.model('User', UsersSchema);