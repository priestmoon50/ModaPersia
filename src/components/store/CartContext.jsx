import React, { createContext, useReducer, useEffect, useContext } from "react";
import { UserContext } from "./UserContext"; // برای دسترسی به وضعیت کاربر
import {
  addCartItem as addCartItemAction,
  removeCartItem as removeCartItemAction,
  clearCart as clearCartAction,
} from "./actions/cartActions"; // اکشن‌های همگام‌سازی با سرور
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
  const { state: userState } = useContext(UserContext); // دسترسی به وضعیت کاربر

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    dispatch({ type: LOAD_CART_FROM_STORAGE, payload: savedCart });
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Add item to cart
  const addCartItem = async (item) => {
    if (!item.productId || !item.name || !item.price) {
      dispatch({ type: SET_ERROR, payload: "Invalid product details" });
      return;
    }

    // Dispatch کردن تغییرات به صورت محلی
    dispatch({ type: ADD_TO_CART, payload: item });

    // ارسال سبد خرید به سرور در صورت موجود بودن توکن کاربر
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
    // Dispatch کردن تغییرات به صورت محلی
    dispatch({ type: REMOVE_FROM_CART, payload: item });

    // ارسال سبد خرید به سرور در صورت موجود بودن توکن کاربر
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
    // Dispatch کردن تغییرات به صورت محلی
    dispatch({ type: CLEAR_CART });

    // پاک کردن سبد خرید از سرور در صورت موجود بودن توکن کاربر
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
