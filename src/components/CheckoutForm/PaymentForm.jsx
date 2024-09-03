import React from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button, CircularProgress, Alert } from "@mui/material";
import { CardElement } from "@stripe/react-stripe-js";  
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";  // <-- Add this import

const PaymentForm = ({
  paymentMethod,
  setPaymentMethod,
  handleSubmit,
  isFormValid,
  loading,
  error,
  success,
  handlePayPalApprove,
  calculateTotal,
}) => {

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Payment
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Payment successful! Your order has been placed.</Alert>}
      {loading && <CircularProgress />}

      <Typography variant="h6" component="h3" gutterBottom>
        Select Payment Method
      </Typography>
      <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <FormControlLabel value="stripe" control={<Radio />} label="Credit Card (Stripe)" />
        <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
        <FormControlLabel value="sofort" control={<Radio />} label="Sofort (Germany)" />
        <FormControlLabel value="giropay" control={<Radio />} label="Giropay (Germany)" />
        <FormControlLabel value="ideal" control={<Radio />} label="iDEAL (Netherlands)" />
      </RadioGroup>

      {paymentMethod === "stripe" && <CardElement />}
      {paymentMethod === "paypal" && (
        <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: calculateTotal(),
                    },
                  },
                ],
              });
            }}
            onApprove={handlePayPalApprove}
          />
        </PayPalScriptProvider>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isFormValid || loading}
        sx={{ mt: 3 }}
      >
        Pay
      </Button>
    </Box>
  );
};

export default PaymentForm;
