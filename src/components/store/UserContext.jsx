import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from "./constants/userConstants";

import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { userReducer, userInitialState } from "./reducers/userReducer";
import { login, logout, register, getUserDetails } from "./actions/userActions";

// ایجاد Context برای User
const UserContext = createContext();

const UserProvider = ({ children }) => {
  // استفاده از userReducer و userInitialState برای مدیریت وضعیت
  const [state, dispatch] = useReducer(userReducer, userInitialState);
  const [error, setError] = useState(null);

  // تابع عمومی برای مدیریت خطاها
  const handleError = useCallback((error, customMessage = "") => {
    console.error(`${customMessage} Error:`, error);
    const errorMessage = error.response?.data?.message || error.message;
    setError(errorMessage);
  }, []);

  // بارگذاری اطلاعات کاربر از localStorage در بارگذاری اولیه
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      dispatch({ type: USER_LOGIN_SUCCESS, payload: parsedUserInfo });
    }
  }, [dispatch]);

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
      return () => {
        axios.interceptors.request.eject(requestInterceptor);
      };
    }
  }, [state.userLogin.userInfo]);

  const logoutUser = useCallback(() => {
    dispatch({ type: USER_LOGOUT });
    logout(dispatch);
    localStorage.removeItem("userInfo");
  }, [dispatch]);

  // بررسی انقضای توکن
  useEffect(() => {
    const checkTokenExpiration = () => {
      const userInfo = state.userLogin.userInfo;
      if (userInfo && userInfo.token) {
        const tokenExpiration = new Date(userInfo.tokenExpiration); // فرض کنید `tokenExpiration` در userInfo وجود دارد
        if (new Date() >= tokenExpiration) {
          logoutUser();
          setError("Session expired. Please log in again.");
        }
      }
    };
    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000); // هر دقیقه توکن چک می‌شود
    return () => clearInterval(intervalId);
  }, [state.userLogin.userInfo, logoutUser]);

  // توابع برای عملیات مربوط به کاربر
  const registerUser = useCallback(
    async (name, email, password) => {
      try {
        const response = await register(name, email, password, dispatch);
        // ذخیره اطلاعات کاربر در localStorage بعد از ثبت‌نام موفق
        localStorage.setItem("userInfo", JSON.stringify(response));
        dispatch({ type: USER_LOGIN_SUCCESS, payload: response });
      } catch (error) {
        handleError(error, "Failed to register user");
        throw new Error(error.message);
      }
    },
    [dispatch, handleError]
  );

  const getUserDetailsAction = useCallback(
    async (id) => {
      try {
        await getUserDetails(id, dispatch);
      } catch (error) {
        handleError(error, "Failed to fetch user details");
      }
    },
    [dispatch, handleError]
  );

  const loginUser = useCallback(
    async (email, password) => {
      try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const response = await login(email, password, dispatch);
        // ذخیره اطلاعات کاربر در localStorage بعد از ورود موفق
        localStorage.setItem("userInfo", JSON.stringify(response));
        dispatch({ type: USER_LOGIN_SUCCESS, payload: response });
      } catch (error) {
        handleError(error, "Failed to login user");
        dispatch({
          type: USER_LOGIN_FAIL,
          payload: error.message || "Failed to login",
        });
        throw new Error(error.message);
      }
    },
    [dispatch, handleError]
  );

  // ارائه context به کامپوننت‌های فرزند
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
