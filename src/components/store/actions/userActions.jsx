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

// Utility functions
const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || "An error occurred";
};

// بهبود تابع getConfig
const getConfig = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return userInfo?.token
    ? {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    : {};
};

// ذخیره اطلاعات در localStorage
const saveUserInfoToStorage = (userInfo) => {
  if (userInfo) {
    try {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {
      console.error("Error saving userInfo to localStorage:", error);
    }
  }
};

// پاک‌سازی اطلاعات از localStorage
const clearUserInfoFromStorage = () => {
  localStorage.removeItem("userInfo");
};

// مدیریت خطاها و ریدایرکت
const handleErrorAndRedirect = (error, dispatch, type, navigate) => {
  const errorMessage = getErrorMessage(error);
  dispatch({ type, payload: errorMessage });

  if (error.response?.status === 401) {
    navigate("/login");
  }
};

// Login User
export const login = async (email, password, dispatch, navigate) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const { data } = await axios.post("/api/users/login", { email, password });

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    saveUserInfoToStorage(data);  // به جای ذخیره‌سازی مستقیم در localStorage

    navigate("/products");
  } catch (error) {
    handleErrorAndRedirect(error, dispatch, USER_LOGIN_FAIL, navigate);
  }
};

// Register User
export const register = async (name, email, password, dispatch, navigate) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const { data } = await axios.post("/api/users/register", {
      name,
      email,
      password,
    });

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    saveUserInfoToStorage(data);  // به جای ذخیره‌سازی مستقیم در localStorage

    navigate("/products");
  } catch (error) {
    handleErrorAndRedirect(error, dispatch, USER_REGISTER_FAIL, navigate);
  }
};

// Get User Details
export const getUserDetails = async (id, dispatch, navigate) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const config = getConfig();
    if (!config.headers.Authorization) {
      throw new Error("User is not authenticated");
    }

    const { data } = await axios.get(`/api/users/${id}/profile`, config);

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    handleErrorAndRedirect(error, dispatch, USER_DETAILS_FAIL, navigate);
  }
};

// Logout User
export const logout = (dispatch, navigate) => {
  clearUserInfoFromStorage();
  dispatch({ type: USER_LOGOUT });

  navigate("/");
};
