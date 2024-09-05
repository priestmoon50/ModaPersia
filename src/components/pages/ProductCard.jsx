import React, { useReducer, useEffect, useMemo, useContext } from "react";
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
import { SERVER_URL } from "../../services/productService";

import CartContext from "../store/CartContext";

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

const normalizeImagePath = (image) => {
  if (image.startsWith("/uploads/")) return `${SERVER_URL}${image}`;
  return `${SERVER_URL}/uploads/${image}`;
};

const ProductCard = ({ product, handleDelete, userInfo }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();
  const { addCartItem, error, isLoading } = useContext(CartContext);
  
  // سایزها و رنگ‌های موجود
  const sizes = useMemo(() => product.sizes || [], [product.sizes]);
  const colors = useMemo(() => product.colors || [], [product.colors]);
  const images = useMemo(() => product.images.map(normalizeImagePath) || [], [
    product.images,
  ]);

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

    if (sizes.length > 0) {
      dispatch({
        type: ACTIONS.SET_SIZE,
        payload: sizes[0],
      });
    }
  }, [colors, images, sizes]);

  const onSubmit = async (data) => {
    if (!state.selectedColor || !data.selectedSize) {
      console.error("Error: Color or size not selected");
      return;
    }

    const cartItem = {
      productId: String(product._id),
      name: product.name,            // اضافه کردن نام محصول
      price: product.price,          // اضافه کردن قیمت محصول
      quantity: 1,
      color: state.selectedColor,    // رنگ انتخاب شده
      size: data.selectedSize,       // سایز انتخاب شده
    };

    try {
      await addCartItem(cartItem); // ارسال آیتم به سبد خرید
      console.log("Product successfully added to cart:", product.name);
    } catch (err) {
      console.error("Error adding product to cart:", err);
    }
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
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "2px solid #f8bbd0",
        borderRadius: "15px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardMedia
        component="img"
        alt={product.name}
        height="200"
        image={state.mainImage}
        sx={{ objectFit: "contain", borderRadius: "15px 15px 0 0" }}
        crossOrigin="anonymous"
      />
      <CardContent sx={{ flexGrow: 1, overflowY: "auto", padding: "16px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h5" component="div" color="#d81b60">
            {product.name}
          </Typography>
          {userInfo && !userInfo.isAdmin && (
            <AddToFavoritesButton productId={product._id} />
          )}
        </Box>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          {product.description}
        </Typography>

        <Typography
          variant="body2"
          color="#d81b60"
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
              defaultValue={state.selectedSize || ""}
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
                  sx={{ marginBottom: "16px", borderColor: "#d81b60" }}
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
                defaultValue={state.selectedColor || ""}
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
                            field.value === color
                              ? "2px solid #d81b60"
                              : "1px solid #d81b60",
                        }}
                        inputProps={{ "aria-label": color }}
                      />
                    ))}
                  </>
                )}
              />
            </Box>
          </FormControl>

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
                    borderRadius: "8px",
                    border:
                      state.selectedColor === colors[index]
                        ? "2px solid #8c1bd8c1"
                        : "1px solid #d81b60",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.SET_MAIN_IMAGE,
                      payload: image,
                    });
                  }}
                  crossOrigin="anonymous"
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
            color="secondary"
            type="submit"
            sx={{ mt: 2, backgroundColor: "#d81b60" }}
            disabled={!state.selectedSize || !state.selectedColor || isLoading} // جلوگیری از افزودن در حین لودینگ
          >
            {isLoading ? "Adding to Cart..." : "Add to Cart"}{" "}
            {/* نمایش وضعیت لودینگ */}
            {error && <Typography color="error">{error}</Typography>}{" "}
            {/* نمایش خطا */}
          </Button>
        </form>

        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to={`/product/${product._id}`}
          state={{ product }}
          sx={{ mt: 2, borderColor: "#d81b60", color: "#d81b60" }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
