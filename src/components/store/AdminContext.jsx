import React, { createContext, useReducer, useCallback, useState, useEffect } from "react";
import { adminReducer, initialAdminState } from "./reducers/adminReducer";
import { adminLogin, adminLogout } from "./actions/adminActions";
import {
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT,
} from "./constants/adminConstants";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialAdminState);
  const [error, setError] = useState(null);

  const handleError = useCallback((error, customMessage = "") => {
    console.error(`${customMessage} Error:`, error);
    const errorMessage = error.response?.data?.message || error.message;
    setError(errorMessage);
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      if (parsedUserInfo.isAdmin) {
        dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: parsedUserInfo });
      }
    }
  }, []); // حذف `dispatch` از وابستگی‌های useEffect

  const loginAdmin = useCallback(
    async (email, password) => {
      try {
        dispatch({ type: ADMIN_LOGIN_REQUEST });
        const result = await adminLogin(email, password, dispatch);
        return result; // برگرداندن نتیجه برای استفاده از خارج
      } catch (error) {
        handleError(error, "Failed to login admin");
        dispatch({
          type: ADMIN_LOGIN_FAIL,
          payload: error.message || "Failed to login admin",
        });
        throw error; // برگرداندن خطا برای استفاده از خارج
      }
    },
    [dispatch, handleError]
  );

  const logoutAdmin = useCallback(() => {
    dispatch({ type: ADMIN_LOGOUT });
    adminLogout(dispatch);
    localStorage.removeItem("userInfo");
  }, [dispatch]);

  return (
    <AdminContext.Provider
      value={{
        state,
        loginAdmin,
        logoutAdmin,
        error,
        clearError: () => setError(null), // اضافه کردن تابع برای ریست خطا
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext, AdminProvider };
