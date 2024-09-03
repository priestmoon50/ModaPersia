import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: '',
    variants: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    // ایجاد FormData برای ارسال داده‌ها
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('discountPercentage', product.discountPercentage);

    product.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][color]`, variant.color);
      formData.append(`variants[${index}][size]`, variant.size);
      formData.append(`variants[${index}][stock]`, variant.stock);
      formData.append(`variants[${index}][imageUrl]`, variant.imageUrl); // این خط را در صورتی اضافه کنید که از URL های تصویر استفاده می‌کنید
    });

    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        formData, // ارسال فرم داده به جای JSON
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // تنظیم هدر برای ارسال فرم داده
          },
        }
      );
      setNotification({ open: true, message: "Product updated successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error updating product");
    }
  };

  const handleVariantChange = (index, key, value) => {
    const updatedVariants = product.variants.map((variant, i) =>
      i === index ? { ...variant, [key]: value } : variant
    );
    setProduct({ ...product, variants: updatedVariants });
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Edit Product
        </Typography>
        <form onSubmit={handleUpdateProduct}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            required
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
            required
          />

          <TextField
            label="Discount Percentage"
            type="number"
            fullWidth
            margin="normal"
            value={product.discountPercentage}
            onChange={(e) => setProduct({ ...product, discountPercentage: parseFloat(e.target.value) })}
          />

          <Typography variant="h6" gutterBottom>
            Variants
          </Typography>

          {product.variants.map((variant, index) => (
            <Paper key={index} elevation={1} style={{ padding: "15px", marginBottom: "15px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                    >
                      <MenuItem value="Red">Red</MenuItem>
                      <MenuItem value="Blue">Blue</MenuItem>
                      <MenuItem value="Green">Green</MenuItem>
                      <MenuItem value="Yellow">Yellow</MenuItem>
                      {/* Add more colors as needed */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Size"
                    fullWidth
                    margin="normal"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Stock"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value, 10))}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Image URL"
                    fullWidth
                    margin="normal"
                    value={variant.imageUrl}
                    onChange={(e) => handleVariantChange(index, 'imageUrl', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Update Product
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProduct;
