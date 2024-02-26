const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { json } = require("body-parser");
// import userRouter from "./authentication/user.router";

const app = express();

app.use(json());
app.use(cors());
const port = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  res.send(" financial server is running ");
});

// app.use("/api/user", userRouter);

app.all("*", async (req, res, next) => {
  return next(new Error("Invalid route"));
});

app.use((err, req, res, next) => {
  res.json({
    message: err.message || "an unknown error occurred!",
  });
});

// Connecting to Mongodb
const uri = process.env.mongodbUrl;
const initializeConfig = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.log(error);
  }
};

app.listen(port, async () => {
  await initializeConfig();
  console.log(`Listening on port ${port}!!!!!`);
});
