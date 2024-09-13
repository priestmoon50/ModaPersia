import axios from "axios";
import {
  USER_AUTH, // تغییر به استفاده از USER_AUTH
  USER_REGISTER,
  USER_DETAILS,
  USER_PROFILE_UPDATE,
} from "../constants/userConstants";

// Helper Functions
const getErrorMessage = (error) => error.response?.data?.message || error.message || "An error occurred";

const getConfig = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return userInfo?.token
    ? { headers: { Authorization: `Bearer ${userInfo.token}` } }
    : {};
};

const saveUserInfoToStorage = (userInfo) => {
  if (userInfo) localStorage.setItem("userInfo", JSON.stringify(userInfo));
  console.log("UserAction ! User info saved to localStorage:", userInfo);
};

const clearUserInfoFromStorage = () => localStorage.removeItem("userInfo");

const handleError = (error, dispatch, type, navigate, redirectToLogin = false) => {
  const errorMessage = getErrorMessage(error);
  dispatch({ type, payload: errorMessage });
  if (redirectToLogin && error.response?.status === 401) navigate("/login");
};

// Actions
export const login = async (email, password, dispatch, navigate) => {
  try {
    dispatch({ type: USER_AUTH.LOGIN_REQUEST });
    const { data } = await axios.post("/api/users/login", { email, password });
    
    // بررسی پاسخ
    console.log("UserAction! Login response:", data);

    dispatch({ type: USER_AUTH.LOGIN_SUCCESS, payload: data });
    saveUserInfoToStorage(data);
    navigate("/products");
  } catch (error) {
    handleError(error, dispatch, USER_AUTH.LOGIN_FAIL, navigate, true);
  }
};


export const register = async (name, email, password, dispatch, navigate) => {
  try {
    dispatch({ type: USER_REGISTER.REQUEST });
    const { data } = await axios.post("/api/users/register", { name, email, password });
    dispatch({ type: USER_REGISTER.SUCCESS, payload: data });
    saveUserInfoToStorage(data);
    navigate("/products");
  } catch (error) {
    handleError(error, dispatch, USER_REGISTER.FAIL, navigate, true);
  }
};

export const getUserDetails = async (id, dispatch, navigate) => {
  try {
    dispatch({ type: USER_DETAILS.REQUEST });
    const config = getConfig();
    const { data } = await axios.get(`/api/users/${id}/profile`, config);
    dispatch({ type: USER_DETAILS.SUCCESS, payload: data });
  } catch (error) {
    handleError(error, dispatch, USER_DETAILS.FAIL, navigate);
  }
};

export const updateProfile = async (userData, dispatch, navigate) => {
  try {
    dispatch({ type: USER_PROFILE_UPDATE.REQUEST });
    const config = getConfig();
    const { data } = await axios.put(`/api/users/${userData.id}/profile`, userData, config);
    dispatch({ type: USER_PROFILE_UPDATE.SUCCESS, payload: data });
    saveUserInfoToStorage(data);
    navigate("/profile");
  } catch (error) {
    handleError(error, dispatch, USER_PROFILE_UPDATE.FAIL, navigate);
  }
};

export const logout = (dispatch) => {
  clearUserInfoFromStorage();
  dispatch({ type: USER_AUTH.LOGOUT }); // تغییر به USER_AUTH.LOGOUT
  window.location.href = "/";
};
