import React from "react";
import { TextField, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchTerm, setSearchTerm, searchUsers }) => {
  return (
    <Box display="flex" justifyContent="center" mb={2}>
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <Button
              variant="contained"
              color="primary"
              onClick={searchUsers}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
