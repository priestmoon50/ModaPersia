import React, { useReducer, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Box,
  FormControl,
  Grid,
  Select,
  MenuItem,
  Radio,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AddToFavoritesButton from "./AddToFavoritesButton";

const ACTIONS = {
  SET_SIZE: "set-size",
  SET_COLOR: "set-color",
  SET_MAIN_IMAGE: "set-main-image",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SIZE:
      return { ...state, selectedSize: action.payload };
    case ACTIONS.SET_COLOR:
      return {
        ...state,
        selectedColor: action.payload.color,
        mainImage: action.payload.imageUrl,
      };
    case ACTIONS.SET_MAIN_IMAGE:
      return { ...state, mainImage: action.payload };
    default:
      return state;
  }
}

const initialState = {
  selectedSize: "",
  selectedColor: "",
  mainImage: "",
};

const normalizeImagePath = (imagePath) => {
  if (imagePath.startsWith("/uploads/")) {
    return `http://localhost:5000${imagePath}`;
  }
  return `http://localhost:5000/uploads/${imagePath}`;
};

const ProductCard = ({ product, handleDelete, handleAddToCart, userInfo }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();

  const sizes = product.sizes || [];
  const colors = useMemo(() => product.colors || [], [product.colors]); // استفاده از useMemo
  const images = useMemo(() => product.images.map(normalizeImagePath) || [], [product.images]); // استفاده از useMemo

  useEffect(() => {
    if (colors.length > 0) {
      dispatch({
        type: ACTIONS.SET_COLOR,
        payload: {
          color: colors[0],
          imageUrl: images[0],
        },
      });
    }
  }, [colors, images]);

  const onSubmit = (data) => {
    handleAddToCart({
      id: product._id,
      size: data.selectedSize,
      color: state.selectedColor,
      price: product.discountPrice || product.price,
    });
  };

  const handleColorAndImageChange = (color) => {
    const colorIndex = colors.indexOf(color);
    dispatch({
      type: ACTIONS.SET_COLOR,
      payload: { color, imageUrl: images[colorIndex] },
    });
  };

  const finalPrice = product.discountPrice || product.price;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        alt={product.name}
        height="200"
        image={state.mainImage}
        sx={{ objectFit: "contain" }}
      />
      <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          {userInfo && !userInfo.isAdmin && (
            <AddToFavoritesButton productId={product._id} />
          )}
        </Box>

        <Typography
          variant="body2"
          color="textPrimary"
          sx={{
            textDecoration: product.discountPrice ? "line-through" : "none",
          }}
        >
          Price: €{product.price.toFixed(2)}
        </Typography>

        {product.discountPrice && (
          <Typography variant="body1" color="error">
            Discounted Price: €{finalPrice.toFixed(2)}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
          Sizes:
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth>
            <Controller
              name="selectedSize"
              control={control}
              defaultValue={state.selectedSize}
              render={({ field }) => (
                <Select
                  {...field}
                  displayEmpty
                  inputProps={{ "aria-label": "Select size" }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    dispatch({
                      type: ACTIONS.SET_SIZE,
                      payload: e.target.value,
                    });
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Size
                  </MenuItem>
                  {sizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <Typography variant="body2" color="text.secondary" mt={2}>
            Colors:
          </Typography>

          <FormControl component="fieldset">
            <Box display="flex" flexWrap="wrap">
              <Controller
                name="selectedColor"
                control={control}
                defaultValue={state.selectedColor}
                render={({ field }) => (
                  <>
                    {colors.map((color, index) => (
                      <Radio
                        key={index}
                        {...field}
                        checked={field.value === color}
                        onChange={() => {
                          handleColorAndImageChange(color);
                          field.onChange(color);
                        }}
                        name={color}
                        sx={{
                          backgroundColor: color,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          marginRight: 1,
                          border:
                            field.value === color ? "2px solid black" : "none",
                        }}
                        inputProps={{ "aria-label": color }}
                      />
                    ))}
                  </>
                )}
              />
            </Box>
          </FormControl>

          <Typography variant="body2" color="text.secondary" mt={2}>
            Images:
          </Typography>

          <Grid container spacing={1} sx={{ mt: 1 }}>
            {images.map((image, index) => (
              <Grid item key={index} xs={4}>
                <CardMedia
                  component="img"
                  alt={`${product.name} - ${index + 1}`}
                  height="60"
                  image={image}
                  sx={{
                    objectFit: "contain",
                    border:
                      state.selectedColor === colors[index]
                        ? "2px solid black"
                        : "none",
                  }}
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.SET_MAIN_IMAGE,
                      payload: image,
                    });
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {userInfo && userInfo.isAdmin && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate(`/admin/edit-product/${product._id}`);
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(product._id)}
                sx={{ ml: 2 }}
              >
                Delete
              </Button>
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
            disabled={!state.selectedSize || !state.selectedColor}
          >
            Add to Cart
          </Button>
        </form>

        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to={`/product/${product._id}`}
          sx={{ mt: 2 }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
