import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../store/StoreContext";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  Snackbar,
  Alert,
  Grid,
  Radio,
} from "@mui/material";

const ProductDetail = () => {
  const { state, addCartItem } = useContext(StoreContext);
  const { products } = state.productList;
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = () => {
      try {
        const foundProduct = products.find((product) => product._id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          setMainImage(foundProduct.variants[0]?.imageUrl || "DEFAULT_IMAGE_URL");
          setSelectedColor(foundProduct.variants[0]?.color || "");
        } else {
          setError("Product not found");
        }
      } catch (error) {
        setError("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, products]);

  const handleAddToCart = useCallback(async () => {
    if (product) {
      setLoadingAddToCart(true);
      const productDetails = {
        id: product._id,
        name: product.name,
        size: selectedSize,
        color: selectedColor,
        price: product.discountPrice || product.price // ارسال قیمت نهایی
      };
      
      try {
        await addCartItem(productDetails);
        setSnackbar({ open: true, message: 'Product added to cart', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to add product to cart', severity: 'error' });
      } finally {
        setLoadingAddToCart(false);
      }
    }
  }, [product, selectedSize, selectedColor, addCartItem]);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const selectedVariant = product.variants.find(
      (variant) => variant.color === color
    );
    if (selectedVariant) {
      setMainImage(selectedVariant.imageUrl);
    }
  };

  const handleSnackbarClose = useCallback(() => {
    setSnackbar({ ...snackbar, open: false });
  }, [snackbar]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Typography
          color="error"
          variant="h5"
          component="h2"
          align="center"
          mt={5}
        >
          {error}
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="primary" onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  const stock = product.variants.reduce(
    (acc, variant) => acc + variant.stock,
    0
  );

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card>
        <CardMedia
          component="img"
          alt={product.name}
          height="400"
          image={mainImage}
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            {product.name}
          </Typography>
          <Box sx={{ overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto" }}>
            <Typography variant="body1" color="textSecondary" paragraph>
              {product.description}
            </Typography>
          </Box>
          <Typography variant="h5" component="p" sx={{ textDecoration: product.discountPrice ? "line-through" : "none" }}>
            Price: €{product.price.toFixed(2)}
          </Typography>
          {product.discountPrice && (
            <Typography variant="h6" component="p" color="primary">
              Discounted Price: €{product.discountPrice.toFixed(2)}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" mt={2}>
            Sizes:
          </Typography>

          <FormControl fullWidth>
            <Select
              value={selectedSize}
              onChange={handleSizeChange}
              displayEmpty
              inputProps={{ "aria-label": "Select size" }}
            >
              <MenuItem value="" disabled>
                Select Size
              </MenuItem>
              {product.variants.map((variant) => (
                <MenuItem key={variant.size} value={variant.size} disabled={variant.stock === 0}>
                  {variant.size} {variant.stock === 0 ? "(Out of Stock)" : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary" mt={2}>
            Colors:
          </Typography>

          <FormControl component="fieldset">
            <Box display="flex" flexWrap="wrap">
              {product.variants.map((variant, index) => (
                <Radio
                  key={`${variant.color}-${index}`}
                  checked={selectedColor === variant.color}
                  onChange={() => handleColorChange(variant.color)}
                  name={variant.color}
                  sx={{
                    backgroundColor: variant.color,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    marginRight: 1,
                    border: selectedColor === variant.color ? "2px solid black" : "none",
                  }}
                />
              ))}
            </Box>
          </FormControl>

          <Typography
            variant="body2"
            color={stock <= 2 ? "error" : "text.secondary"}
            mt={2}
          >
            {stock <= 2 ? `Only ${stock} left in stock!` : `In Stock: ${stock}`}
          </Typography>

          <Grid container spacing={1} sx={{ mt: 1 }}>
            {product.variants.map((variant, index) => (
              <Grid item key={`image-${index}`} xs={4}>
                <CardMedia
                  component="img"
                  alt={`${product.name} - ${index + 1}`}
                  height="60"
                  image={variant.imageUrl || "DEFAULT_IMAGE_URL"} 
                  sx={{
                    objectFit: "contain",
                    border:
                      selectedColor === variant.color
                        ? "2px solid black"
                        : "none",
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/products"
            >
              Back to Products
            </Button>
            {stock > 0 && (
              <Button
                variant="contained"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || loadingAddToCart}
              >
                {loadingAddToCart ? <CircularProgress size={24} /> : "Add to Cart"}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;
