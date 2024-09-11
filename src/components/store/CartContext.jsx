import React, { createContext, useReducer, useEffect, useContext } from "react";
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
} from "./constants/cartConstants";
import { cartReducer } from './reducers/cartReducer';  // فرض بر اینکه فایل cartReducer.js در پوشه store است

const CartContext = createContext();

const initialState = {
  cartItems: [],
  error: null,
  isLoading: false,
};

// CartProvider کامپوننت
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { state: userState } = useContext(UserContext);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    dispatch({ type: LOAD_CART_FROM_STORAGE, payload: savedCart });
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: "Failed to save cart in localStorage" });
    }
  }, [state.cartItems]);

  // Add item to cart
  const addCartItem = async (item) => {
    if (!item.productId || !item.name || !item.price) {
      dispatch({ type: SET_ERROR, payload: "Invalid product details" });
      return;
    }

    // Dispatch تغییرات محلی
    dispatch({ type: ADD_TO_CART, payload: item });

    // ارسال به سرور در صورت موجود بودن توکن
    if (userState.userLogin.userInfo?.token) {
      try {
        await addCartItemAction(dispatch, item, userState.userLogin.userInfo.token);
      } catch (error) {
        console.error("Error syncing cart with server:", error);
        dispatch({ type: SET_ERROR, payload: "Failed to sync cart with server" });
      }
    }
  };

  // Remove item from cart
  const removeCartItem = async (item) => {
    // Dispatch تغییرات محلی
    dispatch({ type: REMOVE_FROM_CART, payload: item });

    // ارسال به سرور در صورت موجود بودن توکن
    if (userState.userLogin.userInfo?.token) {
      try {
        await removeCartItemAction(dispatch, item, userState.userLogin.userInfo.token);
      } catch (error) {
        console.error("Error removing item from cart on server:", error);
        dispatch({ type: SET_ERROR, payload: "Failed to remove item from server" });
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    // Dispatch تغییرات محلی
    dispatch({ type: CLEAR_CART });

    // پاک کردن سبد خرید از سرور
    if (userState.userLogin.userInfo?.token) {
      try {
        await clearCartAction(dispatch, userState.userLogin.userInfo.token);
      } catch (error) {
        console.error("Error clearing cart on server:", error);
        dispatch({ type: SET_ERROR, payload: "Failed to clear cart on server" });
      }
    }
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
