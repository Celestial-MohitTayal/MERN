// server.js
const express = require("express");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware to parse JSON in request body
app.use(express.json());

// Middleware To resolve error related to cors (access-control-allow-origin)
app.use(cors());

// File Path Variable using path library
const usersFilePath = path.join(__dirname, "users.json");

// Fetch data and saving to file
const fetchUsersFromApi = async () => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const users = response.data;
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2)); // Save to local file
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Stopping fetching of data if it is already fetched once.
if (!fs.existsSync(usersFilePath)) {
  fetchUsersFromApi();
}

// Helper function to read users from the file
const getUsers = () => {
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
};

// Route to get all users
app.get("/users", (req, res) => {
  const users = getUsers();
  res.json(users);
});

// Route to add a new user
app.post("/users", (req, res) => {
  const users = getUsers();
  const newUser = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  res.status(201).json(newUser);
});

// Route to edit an existing user
app.put("/users/:id", (req, res) => {
  const users = getUsers();
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body }; //using spread operator to update the user data
    // console.log(users[userIndex]);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2)); // Save the updated list
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Route to delete a user
app.delete("/users/:id", (req, res) => {
  const users = getUsers();
  const userId = parseInt(req.params.id);
  const newUsers = users.filter((user) => user.id !== userId);

  if (newUsers.length !== users.length) {
    fs.writeFileSync(usersFilePath, JSON.stringify(newUsers, null, 2)); // Save the updated list
    res.status(200).json({ message: "User deleted" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Route to search users by name 
app.get("/users/search", (req, res) => {
    const query = req.query.name.toLowerCase();
    const users = getUsers();
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(query)
    );
    res.json(filteredUsers);
  });

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
