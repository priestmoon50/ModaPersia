import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // اطلاعات سفارش را از localStorage بازیابی می‌کنیم
    const savedOrder = JSON.parse(localStorage.getItem('orderDetails'));
    
    if (savedOrder) {
      setOrderDetails(savedOrder);
    } else {
      // اگر سفارشی وجود ندارد، به صفحه اصلی یا سبد خرید هدایت می‌شویم
      navigate('/');
    }
  }, [navigate]);

  if (!orderDetails) {
    return (
      <Container>
        <Typography variant="h6">No order found!</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order Confirmed!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for your purchase. Your order has been successfully placed.
      </Typography>

      {/* نمایش شماره سفارش */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Order ID: {orderDetails._id}</Typography>
      </Box>

      {/* نمایش جزئیات سفارش */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Order Summary</Typography>
        {orderDetails.orderItems.map((item, index) => (
          <Typography key={index}>
            {item.name} ({item.quantity} x €{item.price.toFixed(2)}) = €{(item.quantity * item.price).toFixed(2)}
          </Typography>
        ))}
        <Typography variant="h5" sx={{ mt: 2 }}>
          Total: €{orderDetails.totalPrice.toFixed(2)}
        </Typography>
      </Box>

      {/* دکمه برگشت به صفحه اصلی */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
};

export default OrderConfirmation;
