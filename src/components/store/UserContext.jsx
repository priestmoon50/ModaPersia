import React, { createContext, useReducer, useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from "./constants/userConstants";
import { userReducer, userInitialState } from "./reducers/userReducer";
import { login, logout, register, getUserDetails } from "./actions/userActions";

// ایجاد Context برای User
const UserContext = createContext();

// Utility function برای مدیریت localStorage
const getUserInfoFromStorage = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error parsing userInfo from localStorage:", error);
    return null;
  }
};

// Utility function برای ذخیره‌سازی اطلاعات در localStorage
const saveUserInfoToStorage = (userInfo) => {
  if (userInfo) {
    try {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {
      console.error("Error saving userInfo to localStorage:", error);
    }
  }
};

// Utility function برای پاک‌سازی localStorage
const clearUserInfoFromStorage = () => {
  localStorage.removeItem("userInfo");
};

// Utility function برای مدیریت خطاها
const handleError = (error, customMessage = "") => {
  console.error(`${customMessage} Error:`, error);
  return error.response?.data?.message || error.message || "An unexpected error occurred";
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, userInitialState);
  const [error, setError] = useState(null);

  // بارگذاری اطلاعات کاربر از localStorage در بارگذاری اولیه
  useEffect(() => {
    const parsedUserInfo = getUserInfoFromStorage();
    if (parsedUserInfo) {
      dispatch({ type: USER_LOGIN_SUCCESS, payload: parsedUserInfo });
    }
  }, []);

  // تنظیم هدر Authorization برای درخواست‌های Axios در صورت موجود بودن توکن کاربر
  useEffect(() => {
    const userInfo = state.userLogin.userInfo;
    if (userInfo?.token) {
      const requestInterceptor = axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
          return config;
        },
        (error) => Promise.reject(error)
      );
      return () => axios.interceptors.request.eject(requestInterceptor);
    }
  }, [state.userLogin.userInfo]);

  // تابع logout برای کاربر
  const logoutUser = useCallback(() => {
    dispatch({ type: USER_LOGOUT });
    clearUserInfoFromStorage();
    logout(dispatch);
  }, [dispatch]);

  // بررسی انقضای توکن
  useEffect(() => {
    const checkTokenExpiration = () => {
      const userInfo = state.userLogin.userInfo;
      if (userInfo?.token && userInfo.tokenExpiration) {
        const tokenExpiration = new Date(userInfo.tokenExpiration).getTime();
        if (Date.now() >= tokenExpiration) {
          logoutUser();
          setError("Session expired. Please log in again.");
        }
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000); // هر دقیقه بررسی می‌شود
    return () => clearInterval(intervalId);
  }, [state.userLogin.userInfo, logoutUser]);

  // اکشن ثبت‌نام کاربر
  const registerUser = useCallback(
    async (name, email, password) => {
      try {
        const response = await register(name, email, password, dispatch);
        saveUserInfoToStorage(response);
        dispatch({ type: USER_LOGIN_SUCCESS, payload: response });
      } catch (error) {
        const errorMessage = handleError(error, "Failed to register user");
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [dispatch]
  );

  // اکشن دریافت جزئیات کاربر
  const getUserDetailsAction = useCallback(
    async (id) => {
      try {
        await getUserDetails(id, dispatch);
      } catch (error) {
        const errorMessage = handleError(error, "Failed to fetch user details");
        setError(errorMessage);
      }
    },
    [dispatch]
  );

  // اکشن ورود کاربر
  const loginUser = useCallback(
    async (email, password) => {
      try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const response = await login(email, password, dispatch);
        saveUserInfoToStorage(response);
        dispatch({ type: USER_LOGIN_SUCCESS, payload: response });
      } catch (error) {
        const errorMessage = handleError(error, "Failed to login user");
        dispatch({ type: USER_LOGIN_FAIL, payload: errorMessage });
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [dispatch]
  );

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch,
        loginUser,
        logoutUser,
        registerUser,
        getUserDetailsAction,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
