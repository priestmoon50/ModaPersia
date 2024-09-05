import React, { createContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {
  cartItems: [],
  error: null,
  isLoading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
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
          cartItems: [...state.cartItems, item],  // اینجا مطمئن شوید که name و price به درستی اضافه شده باشند
        };
      }
    

      case "REMOVE_FROM_CART":
        return {
          ...state,
          cartItems: state.cartItems.filter(
            (item) =>
              item.productId !== action.payload.productId ||
              item.size !== action.payload.size ||
              item.color !== action.payload.color
          ),
        };
      

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "CLEAR_CART":
      return { ...state, cartItems: [] };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addCartItem = (item) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeCartItem = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
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
