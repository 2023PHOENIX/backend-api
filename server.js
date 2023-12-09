const express = require("express");
const dotenv = require("dotenv");
const { ConnectionToDB } = require("./connection");
const userRouter = require("./routes/authRoute.js");
const weekListRouter = require("./routes/weeklist.js");

const { authenticateUser } = require("./middlewares/authenticationMiddleWare");
dotenv.config();

const app = express();

app.use("/user", userRouter);
app.use("/weeklist", weekListRouter);
app.get("/dashboard", authenticateUser, (req, res) => {
  res.send({ message: "testing" });
});

// NOTE: used for checking the health of server
app.get("/health", (req, res) => {
  res.send({
    message: "working fine...",
    time: Date.now(),
  });
});

app.listen(process.env.PORT, () => {
  ConnectionToDB();
  console.log("listening to port", `localhost:${process.env.PORT}`);
});

// TODO: something need to be done
// FIX: BUG IS THERE
// HACK: looking very cool
// PERF: looking awesome
// WARNING: warning
