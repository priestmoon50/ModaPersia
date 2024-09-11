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
  Box,
} from "@mui/material";
import CartContext from "./store/CartContext";

// Component: نمایش هر آیتم در سبد خرید
const CartItem = ({ item, onRemove }) => {
  const calculatePrice = (item) => {
    const price = Number(item.discountPrice || item.price) || 0; // استفاده از قیمت تخفیف در صورت وجود
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

// Component: نمایش جمع کل قیمت‌ها و تخفیف‌ها
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

// Component: کنترل‌های سبد خرید (دکمه‌های Checkout و غیره)
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

// Main Cart Component: ترکیب همه بخش‌ها
const Cart = () => {
  const { cartItems, removeCartItem, error } = useContext(CartContext);

  // محاسبه مجموع قیمت کل آیتم‌های سبد خرید (شامل تخفیف‌ها)
  const calculateTotal = useMemo(() => {
    return cartItems
      .reduce((sum, item) => {
        const price = item.discountPrice || item.price; // استفاده از قیمت تخفیف در صورت وجود
        return sum + Number(price) * item.quantity;
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  // محاسبه مجموع کل تخفیف‌ها
  const calculateDiscountTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const discount = item.price - (item.discountPrice || item.price); // محاسبه میزان تخفیف
      return sum + discount * item.quantity;
    }, 0);
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
          <CartItem key={index} item={item} onRemove={handleRemoveFromCart} />
        ))}
      </List>

      <CartSummary total={calculateTotal} discountTotal={calculateDiscountTotal} />
      <CartControls />
    </Container>
  );
};

export default Cart;
