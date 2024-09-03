import React from "react";
import { Box, TextField, Typography, List, ListItem, ListItemText } from "@mui/material";

const CustomerForm = ({ formData, formErrors, handleChange, cartItems, calculateTotal }) => {
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Customer Information
      </Typography>
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={!!formErrors.email}
        helperText={formErrors.email}
      />
      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={!!formErrors.phone}
        helperText={formErrors.phone}
      />
      <TextField
        label="Country"
        name="country"
        value={formData.country}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={!!formErrors.country}
        helperText={formErrors.country}
      />
      <TextField
        label="City"
        name="city"
        value={formData.city}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={!!formErrors.city}
        helperText={formErrors.city}
      />
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={!!formErrors.address}
        helperText={formErrors.address}
      />
      <TextField
        label="Postal Code"
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={!!formErrors.postalCode}
        helperText={formErrors.postalCode}
      />

      <Typography variant="h6" component="h3" gutterBottom>
        Order Summary
      </Typography>
      <List>
        {cartItems.map((item) => (
          <ListItem key={item.product}>
            <ListItemText
              primary={item.name}
              secondary={`Quantity: ${item.qty} - Price: ${item.price}`}
            />
          </ListItem>
        ))}
        <ListItem>
          <ListItemText primary="Total" secondary={`€${calculateTotal()}`} />
        </ListItem>
      </List>
    </Box>
  );
};

export default CustomerForm;
