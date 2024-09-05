import React, { useContext, useMemo } from "react";
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
  const { cartItems, removeCartItem, error } = useContext(CartContext);

  // محاسبه قیمت برای هر آیتم
  const calculatePrice = (item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return (price * quantity).toFixed(2);
  };

  // محاسبه مجموع قیمت کل آیتم‌های سبد خرید
  const calculateTotal = useMemo(() => {
    return cartItems
      .reduce((sum, item) => sum + Number(calculatePrice(item)), 0)
      .toFixed(2);
  }, [cartItems]);

  // مدیریت حذف آیتم از سبد خرید
  const handleRemoveFromCart = (productId, color, size) => {
    removeCartItem({
      productId,
      color,
      size,
    });
  };

  // بررسی خالی بودن سبد خرید
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
        {cartItems.map((item, index) => (
          <ListItem key={`${item.productId}-${index}`}>
            <ListItemText
              primary={`${item.name} (${item.color}, ${item.size})`}
              secondary={`Quantity: ${item.quantity}, Price: €${calculatePrice(item)}`}
            />
            <ListItemSecondaryAction>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveFromCart(item.productId, item.color, item.size)}
              >
                Remove
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" mt={2}>
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
