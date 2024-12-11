// server.js
const express = require("express");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 5000;


// File Path Variable using path library
const usersFilePath = path.join(__dirname, "users.json");

// Fetch data and saving to file
const fetchUsersFromApi = async () => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/users");
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

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
