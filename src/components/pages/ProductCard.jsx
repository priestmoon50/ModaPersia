import React, { useReducer, useEffect, useMemo, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Box,
  FormControl,
  Select,
  MenuItem,
  Radio,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AddToFavoritesButton from "./AddToFavoritesButton";
import { SERVER_URL } from "../../services/productService";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material";
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
  const theme = useTheme();

  // استفاده از useMemo برای بهینه‌سازی
  const sizes = useMemo(() => product.sizes || [], [product.sizes]);
  const colors = useMemo(() => product.colors || [], [product.colors]);
  const images = useMemo(() => product.images.map(normalizeImagePath), [product.images]);

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
      toast.error("Please select both color and size.");
      return;
    }

    if (product.stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: 1,
      color: state.selectedColor,
      size: data.selectedSize,
    };

    try {
      await addCartItem(cartItem);
      toast.success("Product successfully added to cart!");
    } catch (err) {
      console.error("Error adding product to cart:", err);
      toast.error("Failed to add product to cart. Please try again.");
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
        border: "2px solid #4a4a4a",
        borderRadius: "15px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <CardMedia
        component="img"
        alt={product.name}
        height="250"
        image={state.mainImage}
        sx={{
          objectFit: "contain",
          borderRadius: "15px 15px 0 0",
          maxHeight: { xs: "200px", sm: "250px" },
          transition: "transform 0.3s ease",
          marginTop: "16px",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
        crossOrigin="anonymous"
      />

      <CardContent sx={{ flexGrow: 1, overflowY: "auto", padding: "20px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              color: "#f8bbd0",
              fontWeight: "bold",
              fontSize: "1.4rem",
            }}
          >
            {product.name}
          </Typography>
          {userInfo && !userInfo.isAdmin && (
            <AddToFavoritesButton productId={product._id} />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            fontWeight: "500",
            lineHeight: 1.6,
            marginBottom: "12px",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 3,
            textOverflow: "ellipsis",
          }}
        >
          {product.description}
        </Typography>

        {product.discountPrice ? (
          <>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                textDecoration: "line-through",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Original Price: €{product.price.toFixed(2)}
            </Typography>
            <Typography
              variant="body1"
              color="error"
              sx={{
                fontWeight: "bold",
                fontSize: "1.4rem",
                marginTop: "4px",
              }}
            >
              Discounted Price: €{finalPrice.toFixed(2)}
            </Typography>
          </>
        ) : (
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginTop: "4px",
            }}
          >
            Price: €{product.price.toFixed(2)}
          </Typography>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: "bold", marginTop: "8px" }}
        >
          Sizes:
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            sx={{
              minWidth: "100px",
              marginBottom: "8px",
            }}
          >
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
                  sx={{
                    padding: "4px",
                    fontSize: "0.8rem",
                    height: "30px",
                    minWidth: "100px",
                    borderRadius: "4px",
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

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: "bold", marginTop: "8px" }}
          >
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
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          marginRight: 2,
                          border:
                            field.value === color
                              ? "2px solid #39ff14"
                              : "none",
                          "&:hover": {
                            boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
                          },
                          "&:focus-visible": {
                            boxShadow: "0 0 10px #39ff14",
                          },
                        }}
                        inputProps={{ "aria-label": color }}
                      />
                    ))}
                  </>
                )}
              />
            </Box>
          </FormControl>

          {userInfo && userInfo.isAdmin && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate(`/admin/edit-product/${product._id}`);
                }}
                size="small"
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(product._id)}
                size="small"
              >
                Delete
              </Button>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              size="small"
              sx={{
                backgroundColor: "#4a4a4a",
                color: "#fff",
                fontWeight: "bold",
                padding: "8px 16px",
                "&:hover": {
                  backgroundColor: "#66068bac",
                },
                mr: 2,
              }}
              disabled={
                !state.selectedSize || !state.selectedColor || isLoading
              }
            >
              {isLoading ? "Adding to Cart..." : "Add to Cart"}
              {error && <Typography color="error">{error}</Typography>}
            </Button>

            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to={`/product/${product._id}`}
              state={{ product }}
              size="small"
              sx={{
                backgroundColor: "#4a4a4a",
                color: "#fff",
                fontWeight: "bold",
                padding: "8px 16px",
                "&:hover": {
                  backgroundColor: "#66068bac",
                },
              }}
            >
              View Details
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
