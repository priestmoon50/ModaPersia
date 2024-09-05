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
  const { cartItems, clearCart } = useContext(CartContext); // اضافه کردن clearCart برای پاک‌سازی سبد پس از ثبت سفارش
  const { handleSubmit, control } = useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // محاسبه جمع کل سبد خرید
  const calculateTotal = useMemo(() => {
    return cartItems
      .reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0)
      .toFixed(2); // اطمینان از اینکه price و qty وجود دارند
  }, [cartItems]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
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

      // گرفتن توکن از localStorage
      const token = localStorage.getItem("authToken");

      // ارسال اطلاعات سفارش به API با توکن
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // اضافه کردن توکن به هدر
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order. Please try again.");
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
              {item.name} ({item.qty} x €{item.price.toFixed(2)}) = €
              {(item.qty * item.price).toFixed(2)}
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
