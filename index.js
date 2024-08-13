const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
let exercise = require('./models/exercises');
const users = require('./models/users');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.deleteModel('Users');
//console.log(mongoose.model('Users'));


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/delete/:name?', (req,res) => {
  const deleteUser = users.deleteMany({ 'username': req.params.name }, function (err, docs) {
    if (err) {console.log(err);} else {console.log(docs);}
  });
  const findUser = users.find({}, function (err, docs) {
    if (err) {console.log(err);} else {console.log(docs);}
  });
  const countUsers = users.count({}, function (err, docs) {
    if (err) {console.log(err);} else {console.log(docs);}
  });
  console.log(deleteUser.deletedCount);
  res.deleteUser.deletedCount;
})

const findUsers = users.find({}, function (err, docs) {
  if (err) {console.log(err);} else {console.log(docs);}
}).select('_id username');

app.get('/api/users', async (req, res) => {
  //try {
    const allUsers = await users.find({}).select('username _id');
    res.send(allUsers);
  //}
});

app.post('/api/users', async (req, res) => {
  const username = req.body.username;
  console.log(username);

  let newUser = new users({ username: username });

  try {
    const saveUser = await newUser.save();
    const result = await users.findOne({ username: username }).select('username _id');
    res.json(result);
  } catch (err) {
    res.json(err.message);
  }

});

app.post('/api/users/:_id/exercises', async (req, res) => {
  console.log(req.body);
  let newExercise = new exercise(
    { userID: req.body.id,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date
    });

    try {
      const saveExercise = await newExercise.save();
      const result = await 
    }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
