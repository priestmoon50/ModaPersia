import React, { useEffect, useContext, useState } from "react";

import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Box,
  Snackbar,
} from "@mui/material";
import { StoreContext } from "../../store/StoreContext";
import { updateOrderToDeliveredAction, fetchOrderDetails } from "../../store/actions/orderActions";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(StoreContext);
  const { loading, error, order } = state.orderDetails;
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!order || order._id !== id) {
      fetchOrderDetails(id, dispatch);
    }
  }, [id, order, dispatch]);

  const handleMarkAsDelivered = async () => {
    try {
      await updateOrderToDeliveredAction(id, dispatch);
      setNotification({
        open: true,
        message: "Order marked as delivered successfully!",
        severity: "success",
      });
      navigate("/admin/orders");
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Failed to update order status!",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <Alert severity="warning">Order not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>
      <Paper style={{ padding: "20px" }}>
        <Typography variant="h6">Order ID: {order._id}</Typography>
        <Typography>Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
        <Typography>Total: ${order.totalPrice.toFixed(2)}</Typography>
        <Typography>Status: {order.isPaid ? "Paid" : "Pending"}</Typography>
        <Divider style={{ margin: "20px 0" }} />
        <Typography variant="h6" gutterBottom>
          Customer Information:
        </Typography>
        {order.user ? (
          <>
            <Typography>Name: {order.user.name}</Typography>
            <Typography>Email: {order.user.email || "Unknown"}</Typography>
            <Typography>Phone Number: {order.shippingAddress?.phone || "Unknown"}</Typography>
            <Typography>
              Address: {order.shippingAddress?.address}, {order.shippingAddress?.city}, 
              {order.shippingAddress?.country}, {order.shippingAddress?.postalCode}
            </Typography>
          </>
        ) : (
          <Typography>Customer information is not available.</Typography>
        )}
        <Divider style={{ margin: "20px 0" }} />
        <Typography variant="h6" gutterBottom>
          Items:
        </Typography>
        <List>
          {order.orderItems.map((item) => (
            <ListItem key={item.product}>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity} x $${item.price.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>

        <Box display="flex" gap={2} mt={3}>
          {!order.isDelivered && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleMarkAsDelivered}
            >
              Mark as Delivered
            </Button>
          )}
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to="/admin/orders"
          >
            Back to Orders
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderDetails;
