import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const EditUserDialog = ({ openEditDialog, setOpenEditDialog, currentUser, setCurrentUser, editUser }) => {
  return (
    <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={currentUser?.name || ""}
          onChange={(e) =>
            setCurrentUser({ ...currentUser, name: e.target.value })    //spread operator to update the value
          }
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={currentUser?.email || ""}
          onChange={(e) =>
            setCurrentUser({ ...currentUser, email: e.target.value })
          }
        />
        <TextField
          label="City"
          variant="outlined"
          fullWidth
          margin="normal"
          value={currentUser?.address?.city || ""}
          onChange={(e) =>
            setCurrentUser({
              ...currentUser,
              address: { city: e.target.value },
            })
          }
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={currentUser?.phone || ""}
          onChange={(e) =>
            setCurrentUser({ ...currentUser, phone: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenEditDialog(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => editUser(currentUser.id)} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
