// components/Cart.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { StoreContext } from './store/StoreContext';

const Cart = () => {
  const { state, removeCartItem } = useContext(StoreContext);
  const { cartItems } = state.cart;

  const handleRemoveFromCart = (id) => {
    removeCartItem(id);
  };

  const calculatePrice = (item) => {
    const price = item.discountPrice ? item.discountPrice : item.price;
    return (price * item.qty).toFixed(2);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(calculatePrice(item)), 0).toFixed(2);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="h6" component="h2">
          Your cart is empty <Link to="/">Go Back</Link>
        </Typography>
      ) : (
        <div>
          <List>
            {cartItems.map((item) => (
              <ListItem key={item.product}>
                <ListItemText
                  primary={`${item.name} (${item.color}, ${item.size})`} // نمایش ویژگی‌های رنگ و سایز
                  secondary={`€${calculatePrice(item)} (x${item.qty})`}
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveFromCart(item.product)}
                  >
                    Remove
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Typography variant="h5" component="h2">
            Total: €{calculateTotal()}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/checkout"
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Cart;
