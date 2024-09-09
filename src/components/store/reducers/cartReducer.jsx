import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
} from "../constants/cartConstants";

// Utility function برای ذخیره سبد خرید در localStorage
const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (x) => x.productId === item.productId && x.size === item.size && x.color === item.color
      );

      let updatedCartItems;

      if (existingItem) {
        updatedCartItems = state.cartItems.map((x) =>
          x.productId === existingItem.productId &&
          x.size === existingItem.size &&
          x.color === existingItem.color
            ? { ...x, quantity: x.quantity + item.quantity }
            : x
        );
      } else {
        updatedCartItems = [...state.cartItems, item];
      }

      // ذخیره‌سازی سبد خرید به‌روزرسانی‌شده در localStorage
      saveCartToLocalStorage(updatedCartItems);

      return {
        ...state,
        cartItems: updatedCartItems,
      };

    case REMOVE_FROM_CART:
      const filteredCartItems = state.cartItems.filter(
        (x) =>
          x.productId !== action.payload.productId ||
          x.size !== action.payload.size ||
          x.color !== action.payload.color
      );

      // ذخیره‌سازی سبد خرید به‌روزرسانی‌شده در localStorage
      saveCartToLocalStorage(filteredCartItems);

      return {
        ...state,
        cartItems: filteredCartItems,
      };

    case SET_ERROR:
      return { ...state, error: action.payload };

    case CLEAR_CART:
      // پاک کردن سبد خرید از localStorage
      localStorage.removeItem("cartItems");

      return { ...state, cartItems: [] };

    default:
      return state;
  }
};
