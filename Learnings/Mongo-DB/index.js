//MongoDB with Express Js Practice
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const { timeStamp } = require("console");

const app = express(); //app is basically a handler function
const PORT = 8000;

//Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/my-app-1")  //creatng a db names my-app-1
  .then(() => console.log("Mongo DB Connected"))
  .catch((err) => console.log("Mongo Error", err));

//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

//Middleware - Plugin
app.use(express.urlencoded({ extended: false })); //urlencoded - checks header of the req and content-type of the request and parse it and add it to req.body

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}: ${req.method}: ${req.path}\n`,
    (err, data) => next()
  );
});

app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({})
  const html = `
    <ul>
        ${allDbUsers
          .map((user) => `<li>${user.firstName} ${user.lastName} - ${user.email}</li>`)
          .join("")}
    </ul>
    `;
  return res.send(html);
});

app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({})
  return res.json(allDbUsers);
});

app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.gender ||
    !body.email ||
    !body.job_title
  ) {
    res.status(400).json({ msg: "All fields are required" });
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  console.log(result);
  return res.status(201).json({ msg: "success" });
});

app
  .route("/api/users/:id") //same path/url used in multiple requests minimise it using routes
  .get(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);
  })
  .patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {...req.body})
    return res.json({ status: "Success", id: req.params.id });
  })
  .delete(async(req, res) => {
    await User.findByIdAndDelete(req.params.id)
    return res.json({ status: "Deleted Successfully!" });
  });

app.listen(PORT, () => console.log(`Server Started at Port: ${PORT}`)); //Server connection is also take cared by express
