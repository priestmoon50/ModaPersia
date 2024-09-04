import React, { createContext, useReducer, useCallback, useState, useEffect } from "react";
import { adminReducer, initialAdminState } from "./reducers/adminReducer";
import { adminLogin, adminLogout } from "./actions/adminActions";
import {
  ADMIN_LOGIN_SUCCESS,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  DELETE_PRODUCT_SUCCESS,
} from "./constants/adminConstants";
import axios from "axios";

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
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo.isAdmin) {
          dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: parsedUserInfo });
        }
      } catch (e) {
        console.error("Failed to parse user info from localStorage.", e);
      }
    }
  }, [dispatch]);

  const loginAdmin = useCallback(
    async (email, password) => {
      try {
        const result = await adminLogin(email, password, dispatch);
        return result;
      } catch (error) {
        handleError(error, "Failed to login admin");
        throw error;
      }
    },
    [dispatch, handleError]
  );

  const logoutAdmin = useCallback(() => {
    adminLogout(dispatch);
    localStorage.removeItem("userInfo"); // Clean up localStorage when logging out
  }, [dispatch]);

  // Unified function for making API requests with error handling
  const fetchData = useCallback(async (url, method, successType, failureType, data, id) => {
    try {
      dispatch({ type: FETCH_PRODUCTS_REQUEST });
      const response = await axios[method](id ? `${url}/${id}` : url, data);
      dispatch({ type: successType, payload: id || response.data });
    } catch (error) {
      dispatch({ type: failureType, payload: error.message });
      handleError(error, `Failed to ${method} ${url}`);
    }
  }, [dispatch, handleError]);

  const fetchProducts = useCallback(() => fetchData("/api/products", "get", FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE), [fetchData]);

  const deleteProduct = useCallback((id) => fetchData("/api/products", "delete", DELETE_PRODUCT_SUCCESS, FETCH_PRODUCTS_FAILURE, null, id), [fetchData]);

  const editProduct = useCallback((id, updatedProductData) => fetchData("/api/products", "put", FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE, updatedProductData, id), [fetchData]);

  return (
    <AdminContext.Provider
      value={{
        state,
        loginAdmin,
        logoutAdmin,
        fetchProducts,
        deleteProduct,
        editProduct,  // اینجا تابع ویرایش محصول را اضافه کردیم
        error,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext, AdminProvider };
