import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserContext } from '../store/UserContext'; // فرض کنید UserContext حاوی اطلاعات کاربر است

const OrderTracking = () => {
  const { state: userContextState } = useContext(UserContext);
  const { userInfo } = userContextState?.userLogin || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Container>
        <Typography variant="h5">You have no orders yet.</Typography>
        <Button variant="contained" color="primary" component={Link} to="/">
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {orders.map((order) => (
        <Box key={order._id} sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
          <Typography variant="h6">Order ID: {order._id}</Typography>
          <Typography>Status: {order.isDelivered ? 'Delivered' : 'Pending Delivery'}</Typography>
          <Typography>Payment Status: {order.isPaid ? 'Paid' : 'Unpaid'}</Typography>
          <Typography>Placed on: {new Date(order.createdAt).toLocaleDateString()}</Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Items</Typography>
            {order.orderItems.map((item, index) => (
              <Typography key={index}>
                {item.name} ({item.quantity} x €{item.price.toFixed(2)}) = €{(item.quantity * item.price).toFixed(2)}
              </Typography>
            ))}
          </Box>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: €{order.totalPrice.toFixed(2)}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/order/${order._id}`}
            >
              View Order Details
            </Button>
          </Box>
        </Box>
      ))}
    </Container>
  );
};

export default OrderTracking;
