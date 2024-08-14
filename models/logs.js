const mongoose = require('mongoose');
const users = require('./users');
const exercise = require('./exercises');

/*const exerciseLog = new mongoose.Schema({
    username: { type: String, required: true },
    count: { type: Number, required: true },
    _id: { type: String, required: true },
    log: [{
        description: { type: String, required: true },
        duration: { type: Number, required: true },
        date: { type: Date, required: true }
    }]
  },
  { collection: exerciseLog, versionKey: false }
);*/

export async function log(userID) {
    await users.aggregate([
        {
            $lookup: {
                from: "exercise",
                localField: "_id",
                foreignField: "userID",
                as: "exerciseDocs"
            },

            $match: { _id: userID }

        }
    ])
};