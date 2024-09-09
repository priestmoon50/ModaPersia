import React, { useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CartContext from "../store/CartContext";
import CustomerForm from "./CustomerForm"; // فرم اطلاعات مشتری
import PaymentForm from "./PaymentForm"; // فرم اطلاعات پرداخت

const CheckoutForm = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { handleSubmit, control } = useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // محاسبه جمع کل سبد خرید
  const calculateTotal = useMemo(() => {
    return cartItems
      .reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.qty) || 1;
        return sum + price * qty;
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // گرفتن توکن از localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const orderData = {
        customer: {
          name: data.name,
          address: data.address,
          postalCode: data.postalCode,
          phone: data.phone,
        },
        payment: {
          method: data.paymentMethod,
          ...(data.paymentMethod === "creditCard" && {
            cardNumber: data.cardNumber,
            expiryDate: data.expiryDate,
            cvv: data.cvv,
          }),
        },
        items: cartItems,
        total: calculateTotal,
      };

      // ارسال اطلاعات سفارش به API با توکن
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // اضافه کردن توکن به هدر
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order.");
      }

      const savedOrder = await response.json();

      // ذخیره جزئیات سفارش در localStorage
      localStorage.setItem("orderDetails", JSON.stringify(savedOrder));

      // پاک کردن سبد خرید و هدایت به صفحه تایید سفارش
      clearCart();
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error during checkout:", error);
      setError(
        error.message ||
          "An error occurred while processing your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* فرم اطلاعات مشتری */}
        <Box sx={{ mb: 3 }}>
          <CustomerForm control={control} />
        </Box>

        {/* فرم پرداخت */}
        <Box sx={{ mb: 3 }}>
          <PaymentForm control={control} />
        </Box>

        {/* خلاصه سبد خرید */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Order Summary</Typography>
          {cartItems.map((item, index) => (
            <Typography key={index}>
              {item.name} ({item.qty || 1} x €{(item.price || 0).toFixed(2)}) =
              €{((item.qty || 1) * (item.price || 0)).toFixed(2)}
              
            </Typography>
          ))}

          <Typography variant="h5" mt={2}>
            Total: €{calculateTotal}
          </Typography>
        </Box>

        {/* دکمه نهایی کردن خرید */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading} // غیر فعال کردن دکمه در زمان لودینگ
        >
          {loading ? <CircularProgress size={24} /> : "Place Order"}
        </Button>
      </form>
    </Container>
  );
};

export default CheckoutForm;
