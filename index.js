const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient } = require("mongodb");

const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfkri.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Travel-database");
    const plans = database.collection("plans");
    const Contact = database.collection("contact-us");
    // create a document to insert

    app.post("/addplan", async (req, res) => {
      // console.log(req.body);
      const result = await plans.insertOne(req.body);
      res.json(result);
    });
    app.post("/contactus", async (req, res) => {
      // console.log(req.body);
      const result = await Contact.insertOne(req.body);
      res.json(result);
    });

    app.get("/plans", async (req, res) => {
      const query = {};
      const cursor = await plans.find(query).toArray();
      console.log(cursor);
      res.json(cursor);
    });
    app.get("/singleplan/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const cursor = await plans.findOne(query);
      res.json(cursor);
      console.log(cursor);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Pranto Mridha!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
