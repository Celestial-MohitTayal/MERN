import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Button, Box } from "@mui/material";
import SearchBar from "./components/SearchBar";
import UserList from "./components/Userlist";
import AddUserDialog from "./components/AddUserDialog";
import EditUserDialog from "./components/EditUserDialog";

const App = () => {
  const [users, setUsers] = useState([]);   //List of Users
  const [newUser, setNewUser] = useState({  //To add user
    name: "", 
    email: "",
    address: { city: "" },
    phone: "",
  });
  const [currentUser, setCurrentUser] = useState(null); //to edit user
  const [searchTerm, setSearchTerm] = useState(""); //to search user
  const [loading, setLoading] = useState(true); //until data fetchs
  const [openDialog, setOpenDialog] = useState(false);  //add new user dialog/model
  const [openEditDialog, setOpenEditDialog] = useState(false);  //edit dialog/model

  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const addUser = () => {
    axios
      .post("http://localhost:5000/users", newUser)
      .then((response) => {
        setUsers([...users, response.data]);  //spread operator to update th data
        setNewUser({ name: "", email: "", address: { city: "" }, phone: "" });  //removing new user data 
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  const editUser = (id) => {
    axios
      .put(`http://localhost:5000/users/${id}`, currentUser)
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
      .delete(`http://localhost:5000/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id)); //filtering out the id that is deleted.
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const searchUsers = () => {
    axios
      .get(`http://localhost:5000/users/search?name=${searchTerm}`) //by using query parameter
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("Error searching users:", error);
      });
  };

  const openEditDialogHandler = (user) => {
    setCurrentUser({ ...user });
    setOpenEditDialog(true);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" textAlign={"center"} padding={5} gutterBottom>
        User Management
      </Typography>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchUsers={searchUsers}
      />

      <Box display="flex" justifyContent="center" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Add New User
        </Button>
      </Box>

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
    </Container>
  );
};

export default App;
