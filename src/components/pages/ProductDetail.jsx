import React, { useReducer, useEffect, useState  , useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ProductContext } from "../store/ProductContext";
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
import { SERVER_URL } from "../../services/productService";

const ACTIONS = {
  SET_PRODUCT: "set-product",
  SET_SELECTED_SIZE: "set-selected-size",
  SET_SELECTED_COLOR: "set-selected-color",
  SET_MAIN_IMAGE: "set-main-image",
  SET_ERROR: "set-error",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_PRODUCT:
      return {
        ...state,
        product: action.payload.product,
        mainImage: action.payload.mainImage,
        selectedColor: action.payload.selectedColor,
      };
    case ACTIONS.SET_SELECTED_SIZE:
      return { ...state, selectedSize: action.payload };
    case ACTIONS.SET_SELECTED_COLOR:
      return {
        ...state,
        selectedColor: action.payload.color,
        mainImage: action.payload.imageUrl,
      };
    case ACTIONS.SET_MAIN_IMAGE:
      return { ...state, mainImage: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  product: null,
  selectedSize: "",
  selectedColor: "",
  mainImage: "",
  error: null,
};

const normalizeImagePath = (image) => {
  if (image.startsWith("/uploads/")) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/uploads/${image}`;
};

const ProductDetail = () => {
  const { state: productContextState } = useContext(ProductContext);
  const { products } = productContextState.productList;
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const foundProduct = products.find((product) => product._id === id);
        if (foundProduct) {
          const normalizedImages = foundProduct.images.map(normalizeImagePath);
          dispatch({
            type: ACTIONS.SET_PRODUCT,
            payload: {
              product: foundProduct,
              mainImage: normalizedImages[0] || "DEFAULT_IMAGE_URL",
              selectedColor: foundProduct.colors[0] || "",
            },
          });
        } else {
          dispatch({ type: ACTIONS.SET_ERROR, payload: "Product not found" });
        }
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: "Error fetching product" });
      }
    };

    fetchProduct();
  }, [id, products]);

  const handleSizeChange = (event) => {
    dispatch({ type: ACTIONS.SET_SELECTED_SIZE, payload: event.target.value });
  };

  const handleColorAndImageChange = (color) => {
    const colorIndex = state.product.colors.indexOf(color);
    dispatch({
      type: ACTIONS.SET_SELECTED_COLOR,
      payload: { color, imageUrl: state.product.images[colorIndex] },
    });
  };

  const handleAddToCart = () => {
    console.log("Adding to cart:", {
      id: state.product._id,
      name: state.product.name,
      size: state.selectedSize,
      color: state.selectedColor,
      price: state.product.discountPrice || state.product.price,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (state.error) {
    return (
      <Container maxWidth="md">
        <Typography color="error" variant="h5" component="h2" align="center" mt={5}>
          {state.error}
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="primary" onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  if (!state.product) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card>
        <CardMedia
          component="img"
          alt={state.product.name}
          height="400"
          image={state.mainImage}
          sx={{ objectFit: "contain" }}
          crossOrigin="anonymous"  // استفاده از CORS anonymous
        />
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            {state.product.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {state.product.description}
          </Typography>
          <Typography variant="h5" component="p" sx={{ textDecoration: state.product.discountPrice ? "line-through" : "none" }}>
            Price: €{state.product.price.toFixed(2)}
          </Typography>
          {state.product.discountPrice && (
            <Typography variant="h6" component="p" color="primary">
              Discounted Price: €{state.product.discountPrice.toFixed(2)}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" mt={2}>
            Sizes:
          </Typography>

          <FormControl fullWidth>
            <Select
              value={state.selectedSize}
              onChange={handleSizeChange}
              displayEmpty
              inputProps={{ "aria-label": "Select size" }}
            >
              <MenuItem value="" disabled>
                Select Size
              </MenuItem>
              {state.product.sizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary" mt={2}>
            Colors:
          </Typography>

          <FormControl component="fieldset">
            <Box display="flex" flexWrap="wrap">
              {state.product.colors.map((color, index) => (
                <Radio
                  key={index}
                  checked={state.selectedColor === color}
                  onChange={() => handleColorAndImageChange(color)}
                  name={color}
                  sx={{
                    backgroundColor: color,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    marginRight: 1,
                    border: state.selectedColor === color ? "2px solid black" : "none",
                  }}
                />
              ))}
            </Box>
          </FormControl>

          <Grid container spacing={1} sx={{ mt: 1 }}>
            {state.product.images.map((image, index) => (
              <Grid item key={`image-${index}`} xs={4}>
                <CardMedia
                  component="img"
                  alt={`${state.product.name} - ${index + 1}`}
                  height="60"
                  image={normalizeImagePath(image) || "DEFAULT_IMAGE_URL"}
                  sx={{
                    objectFit: "contain",
                    borderRadius: "8px",
                    border: state.selectedColor === state.product.colors[index] ? "2px solid black" : "none",
                    cursor: "pointer",
                    
                  }}
                  crossOrigin="anonymous"  // استفاده از CORS anonymous
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.SET_MAIN_IMAGE,
                      payload: normalizeImagePath(image),
                    });
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
            <Button
              variant="contained"
              color="secondary"
              sx={{ ml: 2 }}
              onClick={handleAddToCart}
              disabled={!state.selectedSize || !state.selectedColor}
            >
              Add to Cart
            </Button>
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
