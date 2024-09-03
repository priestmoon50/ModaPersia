import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
} from "../constants/userConstants";

// Login User
export const login = async (email, password, dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const { data } = await axios.post("/api/users/login", { email, password });

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));

    // Redirect to products page after successful login
    window.location.href = "/products";
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });

    // Redirect to login page if 401 Unauthorized
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Register User
export const register = async (name, email, password, dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const { data } = await axios.post("/api/users/register", {
      name,
      email,
      password,
    });

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));

    // Redirect to products page after successful registration
    window.location.href = "/products";
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });

    // Redirect to login page if 401 Unauthorized
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Get User Details
export const getUserDetails = async (id, dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/users/${id}`);

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });

    // Redirect to login page if 401 Unauthorized
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Logout
export const logout = (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });

  // Redirect to home page after logout
  window.location.href = "/";
};
