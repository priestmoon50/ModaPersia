import React, { useContext, useEffect, useState, useCallback } from "react";
import { Grid, Container, Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { UserContext } from "../store/UserContext";
import { ProductContext } from "../store/ProductContext";
import ProductCard from "./ProductCard";

const ProductPage = () => {
  const { state: userContextState } = useContext(UserContext);
  const { state: productContextState, fetchProducts, updateProduct, deleteProduct, addProduct } = useContext(ProductContext);

  const { userInfo } = userContextState?.userLogin || {};
  const { products = [], loading, error } = productContextState.productList || {};

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loadingSave, setLoadingSave] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const { handleSubmit, control, reset } = useForm();

  const fetchProductsMemoized = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProductsMemoized();
  }, [fetchProductsMemoized]);

  const handleAddToCart = useCallback((item) => {
    console.log("Item added to cart:", item);
    // منطق افزودن به سبد خرید
  }, []);

  const handleEdit = useCallback(
    (product) => {
      setEditingProduct(product);
      setOpen(true);
      reset(product);
    },
    [reset]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingProduct(null);
  }, []);

  const handleSnackbarOpen = useCallback((message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSave = useCallback(
    async (data) => {
      setLoadingSave(true);
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("discountPercentage", data.discountPercentage || 0);

        formData.append("sizes", JSON.stringify(data.sizes));
        formData.append("colors", JSON.stringify(data.colors));

        if (data.images && data.images.length > 0) {
          Array.from(data.images).forEach((file) => formData.append("images", file));
        }

        if (editingProduct) {
          await updateProduct(editingProduct._id, formData);
          handleSnackbarOpen("Product updated successfully");
        } else {
          await addProduct(formData);
          handleSnackbarOpen("Product added successfully");
        }
        handleClose();
      } catch (error) {
        handleSnackbarOpen(editingProduct ? "Failed to update product" : "Failed to add product", "error");
      } finally {
        setLoadingSave(false);
      }
    },
    [editingProduct, updateProduct, addProduct, handleSnackbarOpen, handleClose]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteProduct(id);
        handleSnackbarOpen("Product deleted successfully");
      } catch (error) {
        handleSnackbarOpen("Failed to delete product", "error");
      }
    },
    [deleteProduct, handleSnackbarOpen]
  );

  const handleAddNewProduct = useCallback(() => {
    navigate("/admin/add-product");
  }, [navigate]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  if (loading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h5">Error: {error}</Typography>;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return <Typography variant="h5">No products found</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      {userInfo && userInfo.isAdmin && (
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleAddNewProduct}>
            Add New Product
          </Button>
        </Box>
      )}
      <Grid container spacing={4}>
        {products.map((product, index) => (
          <Grid item key={`${product._id}-${index}`} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} handleEdit={handleEdit} handleDelete={handleDelete} handleAddToCart={handleAddToCart} userInfo={userInfo} />
          </Grid>
        ))}
      </Grid>

      {open && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleSave)}>
              <Controller name="name" control={control} defaultValue="" render={({ field }) => <TextField {...field} label="Name" fullWidth margin="dense" />} />
              <Controller name="description" control={control} defaultValue="" render={({ field }) => <TextField {...field} label="Description" fullWidth margin="dense" />} />
              <Controller name="price" control={control} defaultValue={0} render={({ field }) => <TextField {...field} label="Price" type="number" fullWidth margin="dense" />} />
              <Controller name="discountPercentage" control={control} defaultValue={0} render={({ field }) => <TextField {...field} label="Discount Percentage" type="number" fullWidth margin="dense" />} />

              <Controller
                name="sizes"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Sizes</InputLabel>
                    <Select {...field} multiple label="Sizes">
                      <MenuItem value="XS">XS</MenuItem>
                      <MenuItem value="S">S</MenuItem>
                      <MenuItem value="M">M</MenuItem>
                      <MenuItem value="L">L</MenuItem>
                      <MenuItem value="XL">XL</MenuItem>
                      <MenuItem value="XXL">XXL</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="colors"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Colors</InputLabel>
                    <Select {...field} multiple label="Colors">
                      <MenuItem value="Red">Red</MenuItem>
                      <MenuItem value="Blue">Blue</MenuItem>
                      <MenuItem value="Green">Green</MenuItem>
                      <MenuItem value="Yellow">Yellow</MenuItem>
                      <MenuItem value="Black">Black</MenuItem>
                      <MenuItem value="White">White</MenuItem>
                      <MenuItem value="Purple">Purple</MenuItem>
                      <MenuItem value="Orange">Orange</MenuItem>
                      <MenuItem value="Pink">Pink</MenuItem>
                      <MenuItem value="Brown">Brown</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <Controller name="images" control={control} defaultValue={[]} render={({ field }) => <TextField {...field} type="file" inputProps={{ multiple: true }} fullWidth margin="dense" />} />

              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={loadingSave}>
                  {loadingSave ? "Saving..." : "Save"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductPage;
