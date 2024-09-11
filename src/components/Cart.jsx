import React, { useContext, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
} from "@mui/material";
import CartContext from "./store/CartContext";

const CartItem = ({ item, onRemove }) => {
  const calculatePrice = (item) => {
    const price = Number(item.discountPrice || item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return (price * quantity).toFixed(2);
  };

  return (
    <ListItem key={`${item.productId}-${item.color}-${item.size}`}>
      <ListItemText
        primary={`${item.name} (${item.color}, ${item.size})`}
        secondary={`Quantity: ${item.quantity}, Price: €${calculatePrice(item)}`}
      />
      <ListItemSecondaryAction>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onRemove(item.productId, item.color, item.size)}
        >
          Remove
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const CartSummary = ({ total, discountTotal }) => {
  return (
    <Box mt={2}>
      <Typography variant="h5">Total: €{total}</Typography>
      {discountTotal > 0 && (
        <Typography variant="h6" color="success">
          You saved: €{discountTotal.toFixed(2)}!
        </Typography>
      )}
    </Box>
  );
};

const CartControls = () => {
  return (
    <Box mt={2}>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/checkout"
        sx={{ mt: 2 }}
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
};

const Cart = () => {
  const { cartItems, removeCartItem, error, isLoading, clearError } = useContext(CartContext);

  const calculateTotal = useMemo(() => {
    return cartItems
      .reduce((sum, item) => {
        const price = item.discountPrice || item.price;
        return sum + Number(price) * item.quantity;
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  const calculateDiscountTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const discount = item.price > (item.discountPrice || item.price)
        ? item.price - item.discountPrice
        : 0;
      return sum + discount * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleRemoveFromCart = (productId, color, size) => {
    removeCartItem({
      productId,
      color,
      size,
    });
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (isLoading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  if (cartItems.length === 0) {
    return (
      <Container>
        <Typography variant="h5">Your cart is empty.</Typography>
        <Link to="/">Go Back to Shop</Link>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <List>
        {cartItems.map((item) => (
          <CartItem key={`${item.productId}-${item.color}-${item.size}`} item={item} onRemove={handleRemoveFromCart} />
        ))}
      </List>

      <CartSummary total={calculateTotal} discountTotal={calculateDiscountTotal} />
      <CartControls />
    </Container>
  );
};

export default Cart;
