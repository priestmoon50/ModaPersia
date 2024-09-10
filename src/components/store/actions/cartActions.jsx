import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
} from "../constants/cartConstants";
import axios from "axios";

// Utility function برای ذخیره‌سازی سبد خرید در localStorage
const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// Utility function برای بارگذاری سبد خرید از localStorage
const loadCartFromLocalStorage = () => {
  const cartItems = localStorage.getItem("cartItems");
  return cartItems ? JSON.parse(cartItems) : [];
};

// افزودن آیتم به سبد خرید
export const addCartItem = async (dispatch, item, token) => {
  console.log("Adding item to cart:", item);

  const cartItems = loadCartFromLocalStorage();
  const existingItem = cartItems.find(
    (x) =>
      x.productId === item.productId && x.size === item.size && x.color === item.color
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

  // ذخیره سبد خرید به‌روزرسانی‌شده در localStorage
  console.log("Updated cartItems:", updatedCartItems);
  saveCartToLocalStorage(updatedCartItems);

  // Dispatch کردن تغییرات
  dispatch({ type: ADD_TO_CART, payload: item });

  // ارسال سبد خرید به سرور در صورت موجود بودن توکن کاربر
  if (token) {
    try {
      console.log("Sending updated cart to server with token:", token);
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
      console.log("Cart synced successfully with server");
    } catch (error) {
      console.error("Error syncing cart with server:", error.response || error);
      dispatch({ type: SET_ERROR, payload: "Failed to sync cart with server" });
    }
  }
};

// حذف آیتم از سبد خرید
export const removeCartItem = async (dispatch, item, token) => {
  console.log("Removing item from cart:", item);

  const cartItems = loadCartFromLocalStorage();
  const updatedCartItems = cartItems.filter(
    (x) =>
      x.productId !== item.productId ||
      x.size !== item.size ||
      x.color !== item.color
  );

  // ذخیره‌سازی سبد خرید به‌روزرسانی‌شده در localStorage
  console.log("Updated cartItems after removal:", updatedCartItems);
  saveCartToLocalStorage(updatedCartItems);

  // Dispatch کردن تغییرات
  dispatch({ type: REMOVE_FROM_CART, payload: item });

  // ارسال سبد خرید به سرور در صورت موجود بودن توکن کاربر
  if (token) {
    try {
      console.log("Sending updated cart to server after removal with token:", token);
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
      console.log("Item removed from cart and synced with server");
    } catch (error) {
      console.error("Error removing item from cart on server:", error.response || error);
      dispatch({ type: SET_ERROR, payload: "Failed to remove item from server" });
    }
  }
};

// پاک کردن سبد خرید
export const clearCart = async (dispatch, token) => {
  console.log("Clearing cart");

  // پاک کردن سبد خرید از localStorage
  localStorage.removeItem("cartItems");

  // Dispatch کردن تغییرات
  dispatch({ type: CLEAR_CART });

  // پاک کردن سبد خرید از سرور در صورت موجود بودن توکن کاربر
  if (token) {
    try {
      console.log("Clearing cart on server with token:", token);
      await axios.delete("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Cart cleared on server");
    } catch (error) {
      console.error("Error clearing cart on server:", error.response || error);
      dispatch({ type: SET_ERROR, payload: "Failed to clear cart on server" });
    }
  }
};
