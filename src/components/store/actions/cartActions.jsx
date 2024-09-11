import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
  CART_LOADING,
  CART_SUCCESS,
} from "../constants/cartConstants";
import axios from "axios";

// Utility function for saving cart items to localStorage
const saveCartToLocalStorage = (cartItems, dispatch) => {
  try {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
    dispatch({ type: SET_ERROR, payload: "Failed to save cart to localStorage" });
  }
};

// Utility function for loading cart items from localStorage
const loadCartFromLocalStorage = (dispatch) => {
  try {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    dispatch({ type: SET_ERROR, payload: "Failed to load cart from localStorage" });
    return [];
  }
};

// Adding item to cart
export const addCartItem = async (dispatch, item, token) => {
  dispatch({ type: CART_LOADING }); // Start loading
  try {
    const cartItems = loadCartFromLocalStorage(dispatch);
    const existingItem = cartItems.find(
      (x) =>
        x.productId === item.productId &&
        x.size === item.size &&
        x.color === item.color
    );

    let updatedCartItems;

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

    saveCartToLocalStorage(updatedCartItems, dispatch);
    dispatch({ type: ADD_TO_CART, payload: item });

    if (token) {
      if (!navigator.onLine) {
        dispatch({
          type: SET_ERROR,
          payload: "You are offline. Cart will be updated when you are back online.",
        });
        return;
      }

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

    dispatch({ type: CART_SUCCESS });
  } catch (error) {
    console.error("Error syncing cart with server:", error.response || error);
    dispatch({
      type: SET_ERROR,
      payload: error.response?.data?.message || "Failed to sync cart with server. Please try again later.",
    });
  }
};

// Removing item from cart
export const removeCartItem = async (dispatch, item, token) => {
  dispatch({ type: CART_LOADING });
  try {
    const cartItems = loadCartFromLocalStorage(dispatch);
    const updatedCartItems = cartItems.filter(
      (x) =>
        x.productId !== item.productId ||
        x.size !== item.size ||
        x.color !== item.color
    );

    saveCartToLocalStorage(updatedCartItems, dispatch);
    dispatch({ type: REMOVE_FROM_CART, payload: item });

    if (token) {
      if (!navigator.onLine) {
        dispatch({
          type: SET_ERROR,
          payload: "You are offline. Cart will be updated when you are back online.",
        });
        return;
      }

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

    dispatch({ type: CART_SUCCESS });
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
  dispatch({ type: CART_LOADING });
  try {
    localStorage.removeItem("cartItems");
    dispatch({ type: CLEAR_CART });

    if (token) {
      if (!navigator.onLine) {
        dispatch({
          type: SET_ERROR,
          payload: "You are offline. Cart will be updated when you are back online.",
        });
        return;
      }

      await axios.delete("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    dispatch({ type: CART_SUCCESS });
  } catch (error) {
    console.error("Error clearing cart on server:", error.response || error);
    dispatch({
      type: SET_ERROR,
      payload: "Failed to clear cart on server. Please try again later.",
    });
  }
};
