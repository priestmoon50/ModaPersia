// cartReducer.js
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
} from "../constants/cartConstants";

export const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (x) => x.productId === item.productId && x.size === item.size && x.color === item.color
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
          (x) =>
            x.productId !== action.payload.productId ||
            x.size !== action.payload.size ||
            x.color !== action.payload.color
        ),
      };

    case SET_ERROR:
      return { ...state, error: action.payload };

    case CLEAR_CART:
      return { ...state, cartItems: [] };

    default:
      return state;
  }
};
