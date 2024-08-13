const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   username: {
    type: String,
    required: [true, 'A name is required.'],
    unique: [true, 'That username already exists.']
   } 
});

module.exports = mongoose.model('Users', userSchema);