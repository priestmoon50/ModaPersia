import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
  LOAD_CART_FROM_STORAGE,
  CART_LOADING,
  CART_SUCCESS,
} from "../constants/cartConstants";

// ذخیره سبد خرید در localStorage
const saveCartToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  } catch (error) {
    console.error("خطا در ذخیره‌سازی سبد خرید در localStorage:", error);
  }
};

// حذف سبد خرید از localStorage
const clearCartFromLocalStorage = () => {
  try {
    localStorage.removeItem("cartItems");
  } catch (error) {
    console.error("خطا در حذف سبد خرید از localStorage:", error);
  }
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case CART_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        error: null,
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

      saveCartToLocalStorage(updatedCartItems);

      return {
        ...state,
        cartItems: updatedCartItems,
        isLoading: false,
        success: true,
        error: null,
      };
    }

    case REMOVE_FROM_CART: {
      const existingItem = state.cartItems.find(
        (x) =>
          x.productId === action.payload.productId &&
          x.size === action.payload.size &&
          x.color === action.payload.color
      );

      if (!existingItem) {
        return {
          ...state,
          error: "آیتمی با این مشخصات در سبد خرید موجود نیست",
        };
      }

      const filteredCartItems = state.cartItems.filter(
        (x) =>
          x.productId !== action.payload.productId ||
          x.size !== action.payload.size ||
          x.color !== action.payload.color
      );

      saveCartToLocalStorage(filteredCartItems);

      return {
        ...state,
        cartItems: filteredCartItems,
        error: null,
      };
    }

    case SET_ERROR:
      return { ...state, error: action.payload };

    case CLEAR_CART:
      clearCartFromLocalStorage();
      return {
        ...state,
        cartItems: [],
        isLoading: false,
        success: true,
        error: null,
      };

    case LOAD_CART_FROM_STORAGE:
      return {
        ...state,
        cartItems: action.payload || [],
        isLoading: false,
        success: true,
        error: null,
      };

    default:
      return state;
  }
};
