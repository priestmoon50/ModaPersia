import React, { useEffect, useContext } from 'react';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { StoreContext } from './store/StoreContext';

const OrderTracking = () => {
  const { state, listOrders } = useContext(StoreContext);
  const { orders, loading, error } = state.orderList;

  useEffect(() => {
    const userInfo = state.userLogin.userInfo;
    if (userInfo && userInfo.token) {
      listOrders(userInfo.token);
    } else {
      console.error("User is not authenticated");
    }
  }, [listOrders, state.userLogin.userInfo]);

  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        Order Tracking
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : (
        orders && orders.length > 0 ? (
          <List>
            {orders.map((order) => (
              <ListItem key={order._id}>
                <ListItemText primary={`Order ID: ${order._id}`} secondary={`Total: €${order.totalPrice}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No orders found.</Typography>
        )
      )}
    </Container>
  );
};

export default OrderTracking;
