// components/AdminOrderList.jsx
import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableCell,
  TableRow,
  Table,
  TableBody,
  MenuItem,
  TableContainer,
  TableHead,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { StoreContext } from "../../store/StoreContext";
import { deleteOrderAction } from "../../store/actions/orderActions";

const AdminOrderList = () => {
  const { state, dispatch, listAllOrders } = useContext(StoreContext);
  const { orders, loading, error } = state.orderList;
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    if (state.userLogin.userInfo && state.userLogin.userInfo.isAdmin) {
      listAllOrders(dispatch);
    }
}, [listAllOrders, dispatch, state.userLogin.userInfo]);



  const handleFilterChange = useCallback((event) => {
    setFilter(event.target.value);
  }, []);

  const handleDeleteOrder = useCallback((id) => {
    setOrderToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteOrder = useCallback(async () => {
    try {
      await deleteOrderAction(orderToDelete, dispatch);
      setNotification({
        open: true,
        message: "Order deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Failed to delete order!",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  }, [orderToDelete, dispatch]);

  const filteredOrders = orders?.filter((order) => {
    if (filter === "paid" && !order.isPaid) return false;
    if (filter === "pending" && order.isPaid) return false;
    if (searchTerm) {
      return (
        order._id.includes(searchTerm) ||
        (order.user &&
          order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return true;
  });

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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Orders List
      </Typography>

      <Box mb={2}>
        <TextField
          label="Search Orders"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Box mb={2}>
        <TextField
          select
          label="Filter Orders"
          value={filter}
          onChange={handleFilterChange}
          fullWidth
          variant="outlined"
        >
          <MenuItem value="all">All Orders</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </TextField>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(order.totalPrice)}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered ? (
                      <CheckCircle style={{ color: "green" }} />
                    ) : (
                      <Cancel style={{ color: "red" }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {order.user ? order.user.name : "Unknown User"}
                  </TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="space-between">
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/admin/order/${order._id}`}
                        size="small"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteOrder(order._id)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteOrder} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default React.memo(AdminOrderList);
