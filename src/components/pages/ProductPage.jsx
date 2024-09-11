import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Grid,
  Container,
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  TextField, // برای بخش جستجو
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../store/UserContext";
import { ProductContext } from "../store/ProductContext";
import CartContext from "../store/CartContext";
import ProductCard from "./ProductCard";
import ProductFormDialog from "./ProductFormDialog"; // فرم دیالوگ به عنوان یک کامپوننت جداگانه

const ProductPage = () => {
  const { state: userContextState } = useContext(UserContext);
  const { state: productContextState, fetchProducts, updateProduct, deleteProduct, addProduct } = useContext(ProductContext);

  const { userInfo } = userContextState?.userLogin || {};
  const { products = [], loading, error } = productContextState.productList || {};
  const { addCartItem } = useContext(CartContext);
  
  // State برای دسته‌بندی و جستجو
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loadingSave, setLoadingSave] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const fetchProductsMemoized = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProductsMemoized();
  }, [fetchProductsMemoized]);

  const handleAddToCart = useCallback((item) => {
    console.log("Item added to cart:", item);
    addCartItem(item); // اطمینان حاصل کنید که addCartItem در context استفاده می‌شود
  }, [addCartItem]);
  
  // فیلتر محصولات بر اساس دسته‌بندی و جستجو
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEdit = useCallback(
    (product) => {
      setEditingProduct(product);
      setOpen(true);
    },
    []
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
          Array.from(data.images).forEach((file) =>
            formData.append("images", file)
          );
        }
  
        if (editingProduct) {
          await updateProduct(editingProduct._id, formData);
          handleSnackbarOpen("Product updated successfully");
        } else {
          await addProduct(formData);
          handleSnackbarOpen("Product added successfully");
          navigate("/admin/products");
        }
        handleClose();
      } catch (error) {
        handleSnackbarOpen(
          editingProduct ? "Failed to update product" : "Failed to add product",
          "error"
        );
      } finally {
        setLoadingSave(false);
      }
    },
    [editingProduct, updateProduct, addProduct, handleSnackbarOpen, handleClose, navigate]
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
    setEditingProduct(null);
    setOpen(true);
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: "2.5rem", fontWeight: "bold" }}>
        Products
      </Typography>

      {/* بخش جستجو و فیلتر */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "40%" }}
        />
        <Box>
          <Button
            variant={selectedCategory === "all" ? "contained" : "outlined"}
            onClick={() => setSelectedCategory("all")}
            sx={{ mx: 1 }}
          >
            All
          </Button>
          <Button
            variant={selectedCategory === "manto" ? "contained" : "outlined"}
            onClick={() => setSelectedCategory("manto")}
            sx={{ mx: 1 }}
          >
            Mantou
          </Button>
          <Button
            variant={selectedCategory === "pants" ? "contained" : "outlined"}
            onClick={() => setSelectedCategory("pants")}
            sx={{ mx: 1 }}
          >
            Pants
          </Button>
          <Button
            variant={selectedCategory === "shoes" ? "contained" : "outlined"}
            onClick={() => setSelectedCategory("shoes")}
            sx={{ mx: 1 }}
          >
            Shoes
          </Button>
          <Button
            variant={selectedCategory === "newarrivals" ? "contained" : "outlined"}
            onClick={() => setSelectedCategory("newarrivals")}
            sx={{ mx: 1 }}
          >
            New Arrivals
          </Button>
        </Box>
      </Box>

      {userInfo && userInfo.isAdmin && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewProduct}
            sx={{
              padding: "12px 24px",
              fontSize: "1.1rem", // افزایش سایز فونت دکمه‌ها
              fontWeight: "bold",
            }}
          >
            Add New Product
          </Button>
        </Box>
      )}

      <Grid container spacing={2}>
        {filteredProducts.map((product, index) => (
          <Grid
            item
            key={`${product._id}-${index}`}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ transition: "transform 0.3s ease"  }} 
          >
            <ProductCard
              product={product}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleAddToCart={handleAddToCart}
              userInfo={userInfo}
            />
          </Grid>
        ))}
      </Grid>

      {open && (
        <ProductFormDialog
          open={open}
          onClose={handleClose}
          onSubmit={handleSave}
          defaultValues={editingProduct || {}}
          loadingSave={loadingSave}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%", fontSize: "1.1rem", fontWeight: "bold" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductPage;
