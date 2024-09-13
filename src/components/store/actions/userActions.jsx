import axios from "axios";
import {
  USER_AUTH, // تغییر به استفاده از USER_AUTH
  USER_REGISTER,
  USER_DETAILS,
  USER_PROFILE_UPDATE,
} from "../constants/userConstants";

// Helper Functions
const getErrorMessage = (error) => {
  if (error.response) {
    if (error.response.data?.message) {
      return error.response.data.message;
    } else if (error.response.statusText) {
      return error.response.statusText;
    }
  }
  return error.message || "An unknown error occurred";
};

const getConfig = (authRequired = true) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return authRequired && userInfo?.token
    ? { headers: { Authorization: `Bearer ${userInfo.token}` } }
    : {};
};


const saveUserInfoToStorage = (userInfo) => {
  if (userInfo) localStorage.setItem("userInfo", JSON.stringify(userInfo));
  console.log("UserAction! User info saved to localStorage:", userInfo);
};

const clearUserInfoFromStorage = () => localStorage.removeItem("userInfo");

const handleError = (error, dispatch, type, navigate, redirectToLogin = false) => {
  const errorMessage = getErrorMessage(error);
  dispatch({ type, payload: errorMessage });
  if (redirectToLogin && error.response?.status === 401) navigate("/login");
};

// Actions
export const login = async (email, password, dispatch) => {
  try {
    dispatch({ type: USER_AUTH.LOGIN_REQUEST });
    const { data } = await axios.post("/api/users/login", { email, password });
    dispatch({ type: USER_AUTH.LOGIN_SUCCESS, payload: data });
    saveUserInfoToStorage(data);
    return data; // باید داده‌ها را بازگرداند
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: USER_AUTH.LOGIN_FAIL, payload: errorMessage });
    throw error; // خطا را مدیریت کنید
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
    const errorMessage = getErrorMessage(error);
    dispatch({ type: USER_REGISTER.FAIL, payload: errorMessage });
  }
};

export const getUserDetails = async (id, dispatch, navigate) => {
  try {
    dispatch({ type: USER_DETAILS.REQUEST });
    const config = getConfig(); // اضافه کردن توکن به هدرها
    const { data } = await axios.get(`/api/users/${id}/profile`, config); // استفاده از userId در مسیر
    dispatch({ type: USER_DETAILS.SUCCESS, payload: data });
  } catch (error) {
    handleError(error, dispatch, USER_DETAILS.FAIL, navigate);
  }
};
;

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
