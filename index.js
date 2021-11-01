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
    const Bookings = database.collection("bookings");
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
      // console.log(cursor);
      res.json(cursor);
    });
    app.get("/singleplan/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const cursor = await plans.findOne(query);
      res.send(cursor);
      // console.log(cursor);
    });

    // order post
    app.post("/addbooking", async (req, res) => {
      const query = req.body;

      const result = await Bookings.insertOne(query);
      res.json(result);
      console.log(result);
    });
    //get All order
    app.get("/allorders", async (req, res) => {
      const cursor = Bookings.find({});
      const result = await cursor.toArray();
      res.send(result);
      // console.log(result);
    });

    // my order get method
    app.get("/myorders/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email: email };
      const cursor = await Bookings.find(query).toArray();
      res.json(cursor);
      // console.log(cursor);
    });

    //delete order
    app.delete("/deleteorders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Bookings.deleteOne(query);
      console.log(result);
      res.json(result);
    });

    // update orders
    app.put("/updatedorder/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const updatedInfo = req.body;
      const query = { _id: ObjectId(id) };
      const result = await Bookings.updateOne(query, {
        $set: {
          status: updatedInfo.status,
        },
      });

      res.send(result);
      console.log(result);
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
