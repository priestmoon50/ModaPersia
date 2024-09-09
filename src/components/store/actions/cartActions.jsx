import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
} from "../constants/cartConstants";

// Utility function برای ذخیره‌سازی سبد خرید در localStorage
const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// Utility function برای بارگذاری سبد خرید از localStorage
const loadCartFromLocalStorage = () => {
  const cartItems = localStorage.getItem("cartItems");
  return cartItems ? JSON.parse(cartItems) : [];
};

export const addCartItem = (dispatch, item) => {
  const cartItems = loadCartFromLocalStorage();
  const existingItem = cartItems.find(
    (x) => x.productId === item.productId && x.size === item.size && x.color === item.color
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
  saveCartToLocalStorage(updatedCartItems);

  // Dispatch کردن تغییرات
  dispatch({ type: ADD_TO_CART, payload: item });
};

export const removeCartItem = (dispatch, item) => {
  const cartItems = loadCartFromLocalStorage();
  const updatedCartItems = cartItems.filter(
    (x) =>
      x.productId !== item.productId ||
      x.size !== item.size ||
      x.color !== item.color
  );

  // ذخیره‌سازی سبد خرید به‌روزرسانی‌شده در localStorage
  saveCartToLocalStorage(updatedCartItems);

  // Dispatch کردن تغییرات
  dispatch({ type: REMOVE_FROM_CART, payload: item });
};

export const setError = (dispatch, error) => {
  dispatch({ type: SET_ERROR, payload: error });
};

export const clearCart = (dispatch) => {
  // پاک کردن سبد خرید از localStorage
  localStorage.removeItem("cartItems");

  // Dispatch کردن تغییرات
  dispatch({ type: CLEAR_CART });
};
