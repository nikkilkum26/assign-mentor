var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const cors = require("cors");
const url = "mongodb+srv://nikkil:fJ4xAym7Vpucf00T@zencluster.y8kfe.mongodb.net/?retryWrites=true&w=majority";
router.use(bodyParser.json());
router.use(cors({
  origin: "https://assign-mentor-nikkil.netlify.app"
}));
/* GET home page. */
router.get('/students', async function (req, res, next) {

  try {
    let client = await mongoClient.connect(url);

    let db = client.db("zen");
    let list = await db.collection("students").find().toArray();
    client.close();
    res.json(list)
  }
  catch (err) {
    res.json({
      message: "something went wrong"
    })
    console.log(err);
  }


});


router.post("/students", async function (req, res) {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("zen");
    let insertedStudents = await db.collection("students").insertOne({ name: req.body.name })
    client.close();
    res.json({
      message: "created",
      id: insertedStudents.insertedId

    })
  }
  catch (err) {
    res.json({
      message: "something went wrong"
    })
    console.log(err);
  }

})

router.get('/mentors', async function (req, res, next) {

  try {
    let client = await mongoClient.connect(url);

    let db = client.db("zen");
    let list = await db.collection("mentors").find().toArray();
    client.close();
    res.json(list)
  }
  catch (err) {
    res.json({
      message: "something went wrong"
    })
    console.log(err);
  }


});


router.post("/mentors", async function (req, res) {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("zen");
    let insertedStudents = await db.collection("mentors").insertOne({ name: req.body.name })
    client.close();
    res.json({
      message: "created",
      id: insertedStudents.insertedId

    })
  }
  catch (err) {
    res.json({
      message: "something went wrong"
    })
    console.log(err);
  }

})



router.get('/merge/:id', async function (req, res, next) {

  try {
    let client = await mongoClient.connect(url);

    let db = client.db("zen");
    let list = await db.collection("mentors").findOne({ _id: mongodb.ObjectID(req.params.id) });
    client.close();
    res.json(list)
  }
  catch (err) {
    res.json({
      message: "something went wrong"
    })
    console.log(err);
  }
})

router.put('/merge', async function (req, res, next) {


  try
  {
      let s= req.body.studId;
      let m= req.body.mentorId;
      let client=await mongoClient.connect(url);
      let db=client.db("zen");

      let student=await db.collection("students")
      .findOne({_id:mongodb.ObjectID(s)});

      let mentor=await db.collection("mentors")
      .findOne({_id:mongodb.ObjectID(m)});

      await db.collection("students")
      .findOneAndUpdate(
        {_id:mongodb.ObjectID(s)},
        { $set:{mentor:{id:m,name:mentor.name}}}
      );

      await db.collection("mentors")
      .findOneAndUpdate(
        {_id:mongodb.ObjectID(m)},
        { $push:{students:{id:s,name:student.name}}}
      );

      client.close();
      res.json({
          message:"updated!"
      });
  }
  catch(error)
  {
      
      res.json({
        message: "something went wrong"
      });
  }



});



module.exports = router;
