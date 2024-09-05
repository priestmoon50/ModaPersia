import React, { useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import CartContext from "./store/CartContext";

const Cart = () => {
  const { cartItems, error, removeCartItem } = useContext(CartContext); // destructuring مستقیم

  // Handles removing item from cart
  const handleRemoveFromCart = (productId, color, size) => {
    console.log("Removing item:", { productId, color, size });
    removeCartItem({
      productId,
      color,
      size,
    });
  };

  // Safely calculate the price of a single item
  const calculatePrice = (item) => {
    const price = Number(item.price) || 0;  // اطمینان از وجود قیمت
    const qty = Number(item.qty) || 1;      // اطمینان از وجود تعداد
    return (price * qty).toFixed(2);
  };

  // Calculates total price for all items
  const calculateTotal = useMemo(() => {
    return cartItems
      .reduce((sum, item) => {
        const itemTotal = parseFloat(calculatePrice(item));
        return sum + (!isNaN(itemTotal) ? itemTotal : 0);
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  useEffect(() => {
    console.log("Cart items:", cartItems);
  }, [cartItems]);

  // مدیریت خالی بودن سبد خرید
  if (!cartItems || cartItems.length === 0) {
    return (
      <Container>
        <Typography variant="h6" component="h2">
          Your cart is empty <Link to="/">Go Back</Link>
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <List>
        {cartItems.map(({ productId, name, color, size, price, qty }) => (
          <ListItem key={`${productId}-${color}-${size}`}>
            <ListItemText
              primary={`${name} (${color ? color : "No color selected"}, ${
                size ? size : "No size selected"
              })`}
              secondary={`€${calculatePrice({ price, qty })} (x${qty || 1})`}
            />

            <ListItemSecondaryAction>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveFromCart(productId, color, size)}
              >
                Remove
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" component="h2">
        Total: €{calculateTotal}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/checkout"
        sx={{ mt: 2 }}
      >
        Proceed to Checkout
      </Button>
    </Container>
  );
};

export default Cart;
