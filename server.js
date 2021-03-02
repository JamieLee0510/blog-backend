const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/route");
require("dotenv").config();

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

//DB connect
mongoose.connect("mongodb://localhost/lawblog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.on("connected", (err) => {
  if (err) console.log(err);
  console.log("connected to database");
});

//Start Server

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server has started at %s", port);
  }
});
