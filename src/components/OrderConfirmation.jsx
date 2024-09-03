import React, { useContext } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import { StoreContext } from './store/StoreContext';

const OrderConfirmation = () => {
  const { state } = useContext(StoreContext);
  const { order } = state.orderCreate;

  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom sx={{ marginBottom: 2 }}>
        Order Confirmation
      </Typography>
      {order ? (
        <>
          <Typography variant="h6" component="h3" gutterBottom>
            Order ID: {order._id}
          </Typography>
          {order.orderItems && order.orderItems.length > 0 ? (
            <List>
              {order.orderItems.map((item) => (
                <ListItem key={item.product}>
                  <ListItemText 
                    primary={item.name} 
                    secondary={`Quantity: ${item.qty} - Price: €${item.price}`} 
                  />
                </ListItem>
              ))}
              <ListItem>
                <ListItemText primary="Total" secondary={`€${order.totalPrice}`} />
              </ListItem>
            </List>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No items found in the order.
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="body1" color="error">
          Order not found or there was an error fetching the order details.
        </Typography>
      )}
    </Container>
  );
};

export default OrderConfirmation;
