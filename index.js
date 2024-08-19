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
    console.log("Get list of all users");
    const allUsers = await users.find({}).select('username _id');
    res.send(allUsers);
  //}
});

app.post('/api/users', async (req, res) => {
  const username = req.body.username;
  console.log("Create new user: ", username);

  let newUser = new users({ username: username });

  try {
    const saveUser = await newUser.save();
    const result = await users.findOne({ username: username }).select('username _id');
    res.json(result);
  } catch (err) {
    res.json(err.message);
  }

});

app.post('/api/users/:_id?/exercises', async (req, res) => {
  console.log(req.body.username);
  const newID = req.body[':_id'] === undefined ? '66c38a5a6601000000000000' : req.body[':_id'];
  //console.log("POST an exercise", newID, req.body.description, req.body.duration, req.body.date);
  const ISODATE = req.body.date === undefined ? new Date() : new Date(req.body.date);
  const STRINGDATE = ISODATE.toDateString();
  console.log(STRINGDATE);
  let newExercise = new exercise(
    { userID: newID,
      description: req.body.description,
      duration: req.body.duration,
      date: {
        isodate: ISODATE,
        stringdate: STRINGDATE
      }
    });

    function log(userID, exerciseID) {
    users.aggregate([
      {
        $addFields: {
          "userID": {
            "$toString": "$_id"
          }
        }
      },
      {
        $lookup: {
          from: "exercises",
          localField: "userID",
          foreignField: "userID",
          pipeline: [{
            $match: { _id: exerciseID }
          }],
          as: "log"
        }
      } ,
      {
        $match: { userID: userID }
      },
      {
        $project: { 
          username: 1,
          //count: { $size: "$log" },
          _id: "$userID",
          date: { $arrayElemAt: [ "$log.date.stringdate", 0 ] },
          duration: { $arrayElemAt: [ "$log.duration", 0 ] },
          description: { $arrayElemAt: [ "$log.description", 0 ] }         
        }
      }
    ]).exec(function (err, doc) {
      if (err) { console.log("Error on POST an exercise", err); } else { res.json(doc[0]); }
    });
  }

    try {
      const saveExercise = await newExercise.save();
      //res.json(saveExercise._id);
      const result = log(req.body[':_id'], saveExercise._id);
      //res.json(result);
      console.log("Try block post an exercise");
    } catch (err) {
      res.json(err.message);
      console.log(err.message);
    }
})

/*app.get('/api/users/:_id/logs', async (req, res) => {
  console.log(typeof(req.query.to));
  const from = req.query.from === undefined ? new Date("2000-1-1") : new Date(req.query.from);
  //const from = new Date("2024-1-1");
  console.log(from);
  const to = req.query.to === undefined ? new Date("2040-12-31") : new Date(req.query.to);
  //const to = new Date("2040-12-31");
  console.log(to);
  //const limit = req.query.limit === "" ? 9999 : req.query.limit;

  function log(userID) {
    users.aggregate([
      {
        $addFields: {
          "userID": {
            "$toString": "$_id"
          }
        }
      },
      {
        $lookup: {
          from: "exercises",
          localField: "userID",
          foreignField: "userID",
          pipeline: [{
            $match: {
              date: {
                isodate: {
                  $expr: {
                    $gte: from
                  }
                }
              }
            }
          }],
          as: "log"
        }
      } ,
      {
        $match: { 
          userID: userID
        }
      },
      {
        $project: { 
          username: 1,
          count: { $size: "$log" },
          _id: 1,
          log: {description: 1, duration: 1, date: { $arrayElemAt: [ "$log.date.stringdate", 0 ] }}
        }
      }
    ]).exec(function (err, doc) {
      if (err) { console.log(err); } else { res.json(doc[0]); }
    });
    console.log("log");
  }

    try {
      const result = log(req.params._id);
      //res.json(result);
      console.log("get");
    } catch (err) {
      res.json(err.message);
      console.log("err");
    }
})*/

app.get('/api/users/:_id/logs', async (req, res) => {
  console.log("Get logs");
  let reqID;
  let username;
  let hexregex = /^([a-f0-9]{24})$/
  console.log(hexregex.test(req.params._id));
  if (hexregex.test(req.params._id)) {
    reqID = req.params._id;
  } else { reqID = '000000000000000000000000';}
  console.log(reqID);
  let userID = mongoose.Types.ObjectId(reqID);
  
  console.log(userID);
  try {
    const findUser = await users.findOne({ _id: userID });
    username = findUser.username;
    console.log("Try to get username ", username);
  } catch (err) {
    res.json(err.message);
    console.log("username error");
    return;
  }

  const from = req.query.from === undefined ? new Date("2000-1-1") : new Date(req.query.from);
  const to = req.query.to === undefined ? new Date() : new Date(req.query.to);
  console.log("From: ", from, " To: ", to);

  const findExercises = await exercise.find({
    "date.isodate": {
        $gte: from,
        $lte: to
      },
    userID: reqID
    },
    { description: 1, duration: 1, date: "$date.stringdate", _id: 0 },
    { limit: Number(req.query.limit) }
  );
  console.log(findExercises);

  let response = {};
  if (req.query.from === undefined && req.query.to === undefined) {
    response = {_id: reqID, username: username, count: findExercises.length, log: findExercises};
  } else if (req.query.from === undefined && req.query.to !== undefined) {
    response = {_id: reqID, username: username, to: to.toDateString(), count: findExercises.length, log: findExercises};
  } else if (req.query.from !== undefined && req.query.to === undefined) {
    response = {_id: reqID, username: username, from: from.toDateString(), count: findExercises.length, log: findExercises};
  } else {response = {_id: reqID, username: username, from: from.toDateString(), to: to.toDateString(), count: findExercises.length, log: findExercises}}

  res.json(response);
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
