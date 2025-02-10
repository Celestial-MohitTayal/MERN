import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Button, Box } from "@mui/material";
import SearchBar from "./components/SearchBar";
import UserList from "./components/Userlist";
import AddUserDialog from "./components/AddUserDialog";
import EditUserDialog from "./components/EditUserDialog";
import LoginPage from "./components/LoginPage";

const App = () => {
  const [users, setUsers] = useState([]); //List of Users
  const [newUser, setNewUser] = useState({
    //To add user
    name: "",
    email: "",
    address: { city: "" },
    phone: "",
    username: "",
  });
  const [currentUser, setCurrentUser] = useState(null); //to edit user
  const [searchTerm, setSearchTerm] = useState(""); //to search user
  const [loading, setLoading] = useState(true); //until data fetchs
  const [openDialog, setOpenDialog] = useState(false); //add new user dialog/model
  const [openEditDialog, setOpenEditDialog] = useState(false); //edit dialog/model
  const [authenticated, setAuthenticated] = useState(false); //check whether logged in or not

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true); // Set authenticated to true if token is found
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      axios
        .get("http://localhost:5000/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the JWT token in the header
          },
        })
        .then((response) => {
          setUsers(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setLoading(false);
        });
    }
  }, [authenticated]);

  const addUser = () => {
    axios
      .post("http://localhost:5000/users", newUser, {
        //payload - newUser
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUsers([...users, response.data]); //spread operator to update th data
        setNewUser({ name: "", email: "", address: { city: "" }, phone: "" }); //removing new user data
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <LoginPage setAuthenticated={setAuthenticated} />;
  }

  const editUser = (id) => {
    axios
      .put(`http://localhost:5000/users/${id}`, currentUser, {
        //payload - currentUser
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUsers(users.map((user) => (user.id === id ? response.data : user))); //replacing the new data for particular user with new data
        setOpenEditDialog(false);
      })
      .catch((error) => {
        console.error("Error editing user:", error);
      });
  };

  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:5000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id)); //filtering out the id that is deleted.
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const searchUsers = () => {
    axios
      .get(`http://localhost:5000/users/search?name=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }) //by using query parameter
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("Error searching users:", error);
      });
  };

  const openEditDialogHandler = (user) => {
    setCurrentUser({ ...user }); //updating current user to display values in input
    setOpenEditDialog(true);
  };

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        mb={4}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Add New User
        </Button>
        <Typography variant="h4" textAlign={"center"} padding={2} gutterBottom>
          User Management
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchUsers={searchUsers}
      />

      <AddUserDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        newUser={newUser}
        setNewUser={setNewUser}
        addUser={addUser}
      />

      <EditUserDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        editUser={editUser}
      />

      <Box marginBottom={5}>
        {loading ? (
          <Typography variant="h6" color="textSecondary" align="center">
            Loading...
          </Typography>
        ) : (
          <UserList
            users={users}
            openEditDialogHandler={openEditDialogHandler}
            deleteUser={deleteUser}
          />
        )}
      </Box>
    </Container>
  );
};

export default App;
