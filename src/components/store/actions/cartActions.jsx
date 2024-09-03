import axios from "axios";
import { ADD_TO_CART, REMOVE_FROM_CART, RESET_CART } from "../constants/cartConstants";

export const addToCart = async (id, qty, dispatch) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data._id,
        name: data.name,
        imageUrl: data.imageUrl,
        price: data.price,
        discountPrice: data.discountPrice,
        countInStock: data.countInStock,
         qty: qty, // تعداد انتخاب شده توسط کاربر
      },
    });
  } catch (error) {
    console.error("Failed to add to cart:", error);
  }
};

export const removeFromCart = (id, dispatch) => {
  try {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: id,
    });
  } catch (error) {
    console.error("Failed to remove from cart:", error);
  }
};

export const resetCart = (dispatch) => {
  try {
    dispatch({
      type: RESET_CART,
    });
  } catch (error) {
    console.error("Failed to reset cart:", error);
  }
};
