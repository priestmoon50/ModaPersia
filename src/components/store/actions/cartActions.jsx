import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
} from "../constants/cartConstants";
import axios from "axios";

// Utility function for saving cart items to localStorage
const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// Utility function for loading cart items from localStorage
const loadCartFromLocalStorage = () => {
  const cartItems = localStorage.getItem("cartItems");
  return cartItems ? JSON.parse(cartItems) : [];
};

// Adding item to cart
export const addCartItem = async (dispatch, item, token) => {
  dispatch({ type: "CART_LOADING" }); // شروع لودینگ
  try {
    // Load current cart items
    const cartItems = loadCartFromLocalStorage();
    const existingItem = cartItems.find(
      (x) =>
        x.productId === item.productId &&
        x.size === item.size &&
        x.color === item.color
    );

    let updatedCartItems;

    // Update quantity if item already exists in cart
    if (existingItem) {
      updatedCartItems = cartItems.map((x) =>
        x.productId === existingItem.productId &&
        x.size === existingItem.size &&
        x.color === existingItem.color
          ? { ...x, quantity: x.quantity + item.quantity }
          : x
      );
    } else {
      updatedCartItems = [...cartItems, item];
    }

    // Save updated cart items to localStorage
    saveCartToLocalStorage(updatedCartItems);

    // Dispatch updated cart to reducer
    dispatch({ type: ADD_TO_CART, payload: item });

    // Sync cart with server if token is available
    if (token) {
      await axios.post(
        "/api/cart",
        { cartItems: updatedCartItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
    dispatch({ type: "CART_SUCCESS" }); 
  } catch (error) {
    console.error("Error syncing cart with server:", error.response || error);
    dispatch({
      type: SET_ERROR,
      payload: "Failed to sync cart with server. Please try again later.",
    });
  }
};

// Removing item from cart
export const removeCartItem = async (dispatch, item, token) => {
  try {
    const cartItems = loadCartFromLocalStorage();
    const updatedCartItems = cartItems.filter(
      (x) =>
        x.productId !== item.productId ||
        x.size !== item.size ||
        x.color !== item.color
    );

    // Save updated cart items to localStorage
    saveCartToLocalStorage(updatedCartItems);

    // Dispatch updated cart to reducer
    dispatch({ type: REMOVE_FROM_CART, payload: item });

    // Sync cart with server if token is available
    if (token) {
      await axios.post(
        "/api/cart",
        { cartItems: updatedCartItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error removing item from cart on server:", error.response || error);
    dispatch({
      type: SET_ERROR,
      payload: "Failed to remove item from server. Please try again later.",
    });
  }
};

// Clearing the cart
export const clearCart = async (dispatch, token) => {
  try {
    // Clear cart items from localStorage
    localStorage.removeItem("cartItems");

    // Dispatch clear cart to reducer
    dispatch({ type: CLEAR_CART });

    // Clear cart on server if token is available
    if (token) {
      await axios.delete("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Error clearing cart on server:", error.response || error);
    dispatch({
      type: SET_ERROR,
      payload: "Failed to clear cart on server. Please try again later.",
    });
  }
};
