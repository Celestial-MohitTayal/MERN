import React from "react";
import { Grid, Card, CardContent, Typography, CardActions, Button } from "@mui/material";

const UserList = ({ users, openEditDialogHandler, deleteUser }) => {
  return (
    <Grid container spacing={2}>
      {users.map((user) => (
        <Grid item xs={12} sm={6} md={4} key={user.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography color="textSecondary">{user.email}</Typography>
              <Typography color="textSecondary">{user.address.city}</Typography>
              <Typography color="textSecondary">{user.phone}</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => openEditDialogHandler(user)}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserList;
