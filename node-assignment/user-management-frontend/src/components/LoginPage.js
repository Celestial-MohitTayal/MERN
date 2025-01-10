import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import axios from "axios";

const LoginPage = ({ setAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    axios
      .post("http://localhost:5000/login", { username })
      .then((response) => {
        localStorage.setItem("token", response.data.token); // Store JWT token in local storage
        setAuthenticated(true); // Set authenticated state to true
      })
      .catch((err) => {
        setError("Invalid credentials");
      });
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" marginTop={30} align="center" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Enter Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        sx={{ marginTop: 2 }}
      >
        Login
      </Button>
    </Container>
  );
};

export default LoginPage;
