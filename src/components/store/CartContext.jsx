import React, { createContext, useReducer, useEffect, useContext, useCallback } from "react";
import { UserContext } from "./UserContext";
import {
  addCartItem as addCartItemAction,
  removeCartItem as removeCartItemAction,
  clearCart as clearCartAction,
} from "./actions/cartActions";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
  LOAD_CART_FROM_STORAGE,
  CART_LOADING,
  CART_LOADING_END,
} from "./constants/cartConstants";
import { cartReducer } from './reducers/cartReducer';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  error: null,
  isLoading: false,
  success: false,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { state: userState } = useContext(UserContext);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    dispatch({ type: LOAD_CART_FROM_STORAGE, payload: savedCart });
  }, []);

  // Add item to cart
  const addCartItem = useCallback(async (item) => {
    dispatch({ type: CART_LOADING });

    if (!item.productId || !item.name || !item.price) {
      dispatch({ type: SET_ERROR, payload: "Invalid product details" });
      dispatch({ type: CART_LOADING_END });
      return;
    }

    // Add item to local state
    dispatch({ type: ADD_TO_CART, payload: item });

    // Sync with server if online and logged in
    if (userState.userLogin.userInfo?.token && navigator.onLine) {
      try {
        await addCartItemAction(dispatch, item, userState.userLogin.userInfo.token);
        dispatch({ type: CART_LOADING_END });
      } catch (error) {
        dispatch({ type: SET_ERROR, payload: "Failed to sync cart with server" });
      } finally {
        dispatch({ type: CART_LOADING_END });
      }
    } else if (!navigator.onLine) {
      dispatch({ type: SET_ERROR, payload: "You are offline. Cart will sync when you reconnect." });
    } else {
      dispatch({ type: CART_LOADING_END });
    }
  }, [dispatch, userState.userLogin.userInfo]);

  // Remove item from cart
  const removeCartItem = useCallback(async (item) => {
    dispatch({ type: CART_LOADING });
    dispatch({ type: REMOVE_FROM_CART, payload: item });

    // Sync with server if online and logged in
    if (userState.userLogin.userInfo?.token && navigator.onLine) {
      try {
        await removeCartItemAction(dispatch, item, userState.userLogin.userInfo.token);
        dispatch({ type: CART_LOADING_END });
      } catch (error) {
        dispatch({ type: SET_ERROR, payload: "Failed to remove item from server" });
      } finally {
        dispatch({ type: CART_LOADING_END });
      }
    } else if (!navigator.onLine) {
      dispatch({ type: SET_ERROR, payload: "You are offline. Cart changes will sync when you reconnect." });
    } else {
      dispatch({ type: CART_LOADING_END });
    }
  }, [dispatch, userState.userLogin.userInfo]);

  // Clear cart
  const clearCart = useCallback(async () => {
    dispatch({ type: CART_LOADING });
    dispatch({ type: CLEAR_CART });

    // Sync with server if online and logged in
    if (userState.userLogin.userInfo?.token && navigator.onLine) {
      try {
        await clearCartAction(dispatch, userState.userLogin.userInfo.token);
        dispatch({ type: CART_LOADING_END });
      } catch (error) {
        dispatch({ type: SET_ERROR, payload: "Failed to clear cart on server" });
      } finally {
        dispatch({ type: CART_LOADING_END });
      }
    } else if (!navigator.onLine) {
      dispatch({ type: SET_ERROR, payload: "You are offline. Cart will clear on server when you reconnect." });
    } else {
      dispatch({ type: CART_LOADING_END });
    }
  }, [dispatch, userState.userLogin.userInfo]);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        error: state.error,
        isLoading: state.isLoading,
        success: state.success,
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
