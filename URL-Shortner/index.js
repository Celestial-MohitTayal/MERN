const express = require("express");

const { connectToMongoDB } = require("./connect");

const urlRoute = require("./routes/url");

const app = express();
const PORT = 9000;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected!")
);

app.use(express.json());

app.use("/api", urlRoute)

app.get("/", (req, res) => res.send("Hello From Mohit"))

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT} `));
