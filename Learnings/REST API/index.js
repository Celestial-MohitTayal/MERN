//Express Js Practice
const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express(); //app is basically a handler function
const PORT = 8000;

//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}: ${req.method}: ${req.path}\n`,
    (err, data) => next()
  );
});

// app.use((req, res, next) => {
//   console.log('Hello from Middleware 1');
//   req.myUsername = "tayalmohit0103"
//   next();
// })

// app.use((req, res, next) => {
//   console.log('Hello from Middleware 2 -', req.myUsername);
//   // return res.end('Hey');
//   next();
// })

app.get("/users", (req, res) => {
  const html = `
    <ul>
        ${users
          .map((user) => `<li>${user.first_name} ${user.last_name}</li>`)
          .join("")}
    </ul>
    `;
  return res.send(html);
});

app.get("/api/users", (req, res) => {
  // console.log('Hey i am in get route -', req.myUsername);
  return res.json(users);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ id: users.length + 1, ...body });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  });
});

app
  .route("/api/users/:id") //same path/url used in multiple requests minimise it using routes
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    users.splice(userIndex, 1, { id: id, ...req.body });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Success", id: users.length });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    users.splice(userIndex, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Deleted Successfully!" });
    });
  });

app.listen(PORT, () => console.log(`Server Started at Port: ${PORT}`)); //Server connection is also take cared by express
