// cartActions.js
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_ERROR,
  CLEAR_CART,
} from "../constants/cartConstants";

export const addCartItem = (dispatch, item) => {
  dispatch({ type: ADD_TO_CART, payload: item });
};

export const removeCartItem = (dispatch, item) => {
  dispatch({ type: REMOVE_FROM_CART, payload: item });
};

export const setError = (dispatch, error) => {
  dispatch({ type: SET_ERROR, payload: error });
};

export const clearCart = (dispatch) => {
  dispatch({ type: CLEAR_CART });
};
