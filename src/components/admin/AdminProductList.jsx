import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import { AdminContext } from "../store/AdminContext"; // تغییر از StoreContext به AdminContext

const AdminProductList = () => {
  const { state, fetchProducts, deleteProduct } = useContext(AdminContext); // استفاده از AdminContext
  const { products, loading, error } = state.productList;
  const [notification, setNotification] = useState({
    message: "",
    severity: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // اضافه کردن لاگ برای بررسی محصولات
  useEffect(() => {
    console.log('Fetched products:', products);
  }, [products]);

  const handleDeleteProduct = async (id) => {
    setSelectedProductId(id);
    setOpenDialog(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await deleteProduct(selectedProductId);
      setNotification({
        message: "Product deleted successfully!",
        severity: "success",
      });
      fetchProducts(); // بازیابی مجدد لیست محصولات بعد از حذف
    } catch (error) {
      setNotification({
        message: error.message || "Error deleting product",
        severity: "error",
      });
    } finally {
      setOpenSnackbar(true);
      setOpenDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setNotification({ message: "", severity: "" });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteProduct} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>€{product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <ButtonGroup variant="contained">
                      <Button
                        color="primary"
                        component={Link}
                        to={`/admin/edit-product/${product._id}`}
                      >
                        Edit
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="h6" align="center">No products found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default AdminProductList;
