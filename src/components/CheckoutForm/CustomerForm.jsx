import React from "react";
import { Grid, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const CustomerForm = ({ control }) => {
  return (
    <Grid container spacing={0.3}>
      {/* نام کامل */}
      <Grid item xs={12}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "Full name is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Full Name"
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
              sx={{ mb: 3 }}  // فاصله استاندارد بین فیلدها
            />
          )}
        />
      </Grid>

      {/* آدرس */}
      <Grid item xs={12}>
        <Controller
          name="address"
          control={control}
          defaultValue=""
          rules={{ required: "Address is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Address"
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
              sx={{ mb: 3 }}
            />
          )}
        />
      </Grid>

      {/* کد پستی */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="postalCode"
          control={control}
          defaultValue=""
          rules={{
            required: "Postal code is required",
            pattern: {
              value: /^[0-9]{5}$/,
              message: "Invalid postal code",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Postal Code"
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
              sx={{ mb: 3 }}
            />
          )}
        />
      </Grid>

      {/* شماره تلفن */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{
            required: "Phone number is required",
            pattern: {
              value: /^\+?[1-9]\d{1,14}$/,
              message: "Invalid phone number",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Phone Number"
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
              sx={{ mb: 3 }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default CustomerForm;
