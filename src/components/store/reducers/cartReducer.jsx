import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
  LOAD_CART_FROM_STORAGE,
} from "../constants/cartConstants";

// Utility function برای ذخیره‌سازی سبد خرید در localStorage
const saveCartToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Utility function برای حذف سبد خرید از localStorage
const clearCartFromLocalStorage = () => {
  try {
    localStorage.removeItem("cartItems");
  } catch (error) {
    console.error("Error clearing cart from localStorage:", error);
  }
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case "CART_LOADING":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "CART_SUCCESS":
      return {
        ...state,
        isLoading: false,
        success: true,
      };
    case ADD_TO_CART: {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (x) =>
          x.productId === item.productId &&
          x.size === item.size &&
          x.color === item.color
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
        isLoading: false,  // متوقف کردن لودینگ
        success: true,     // به‌روزرسانی موفقیت
      };
    }

    case REMOVE_FROM_CART: {
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
    }

    case SET_ERROR:
      return { ...state, error: action.payload };

    case CLEAR_CART:
      // پاک کردن سبد خرید از localStorage
      clearCartFromLocalStorage();
      return { ...state, cartItems: [] };

    case LOAD_CART_FROM_STORAGE:
      return {
        ...state,
        cartItems: action.payload || [],
      };

    default:
      return state;
  }
};
