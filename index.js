const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 7000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Pranto Mridha!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
