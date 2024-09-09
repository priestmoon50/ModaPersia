import React, { createContext, useReducer, useEffect } from "react";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
  LOAD_CART_FROM_STORAGE,
  
} from "./constants/cartConstants";

const CartContext = createContext();

const initialState = {
  cartItems: [],
  error: null,
  isLoading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (x) =>
          x.productId === item.productId &&
          x.size === item.size &&
          x.color === item.color
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.productId === existingItem.productId &&
            x.size === existingItem.size &&
            x.color === existingItem.color
              ? { ...x, quantity: x.quantity + item.quantity }
              : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) =>
            item.productId !== action.payload.productId ||
            item.size !== action.payload.size ||
            item.color !== action.payload.color
        ),
      };

    case SET_ERROR:
      return { ...state, error: action.payload };

    case CLEAR_CART:
      return { ...state, cartItems: [] };

    case LOAD_CART_FROM_STORAGE:
      return { ...state, cartItems: action.payload };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    dispatch({ type: LOAD_CART_FROM_STORAGE, payload: savedCart });
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const addCartItem = (item) => {
    if (!item.productId || !item.name || !item.price) {
      dispatch({ type: "SET_ERROR", payload: "Invalid product details" });
      return;
    }
    dispatch({ type: ADD_TO_CART, payload: item });
  };

  const removeCartItem = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("cartItems"); // پاک کردن سبد خرید از localStorage
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        error: state.error,
        isLoading: state.isLoading,
        addCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
