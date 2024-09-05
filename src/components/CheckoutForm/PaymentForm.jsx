import React from "react";
import { Grid, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { Controller } from "react-hook-form";

const PaymentForm = ({ control }) => {
  return (
    <Grid container spacing={1}>
      {/* انتخاب روش پرداخت */}
      <Grid item xs={12}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="payment-method-label">Payment Method</InputLabel>
          <Controller
            name="paymentMethod"
            control={control}
            defaultValue="creditCard" // مقدار پیش‌فرض
            render={({ field }) => (
              <Select
                {...field}
                labelId="payment-method-label"
                id="payment-method"
                label="Payment Method"
              >
                <MenuItem value="creditCard">Credit Card</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="cashOnDelivery">Cash on Delivery</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {/* شماره کارت اعتباری */}
      <Grid item xs={12}>
        <Controller
          name="cardNumber"
          control={control}
          defaultValue=""
          rules={{
            required: "Card number is required",
            pattern: {
              value: /^[0-9]{16}$/,
              message: "Invalid card number",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Card Number"
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
              sx={{ mb: 2 }}
            />
          )}
        />
      </Grid>

      {/* تاریخ انقضا */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="expiryDate"
          control={control}
          defaultValue=""
          rules={{
            required: "Expiry date is required",
            pattern: {
              value: /^(0[1-9]|1[0-2])\/\d{2}$/,
              message: "Invalid expiry date (MM/YY)",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Expiry Date (MM/YY)"
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
              sx={{ mb: 0.5 }}
            />
          )}
        />
      </Grid>

      {/* CVV */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="cvv"
          control={control}
          defaultValue=""
          rules={{
            required: "CVV is required",
            pattern: {
              value: /^[0-9]{3,4}$/,
              message: "Invalid CVV",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="CVV"
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
              sx={{ mb: 0.5 }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default PaymentForm; 
