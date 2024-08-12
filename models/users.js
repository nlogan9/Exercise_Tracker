const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   username: {
    type: String,
    required: true
   } 
});

userSchema.indexes();
module.exports = mongoose.model('Users', userSchema);