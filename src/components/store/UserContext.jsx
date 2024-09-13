import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { USER_AUTH, USER_PROFILE_UPDATE } from "./constants/userConstants";
import { userReducer, userInitialState } from "./reducers/userReducer";
import {
  login,
  logout,
  register,
  getUserDetails,
  updateProfile,
} from "./actions/userActions";

// User Context
const UserContext = createContext();

// Utility functions
const getUserInfoFromStorage = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error parsing userInfo from localStorage:", error);
    return null;
  }
};

const saveUserInfoToStorage = (userInfo) => {
  if (userInfo) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    console.log("User info saved to localStorage:", userInfo); // اضافه کردن لاگ برای بررسی
  }
};

const clearUserInfoFromStorage = () => localStorage.removeItem("userInfo");

const handleError = (error, customMessage = "") => {
  return error.response?.data?.message || error.message || customMessage;
};

// User Provider
const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, userInitialState);
  const [error, setError] = useState(null);

// Load user info from localStorage on initial load
useEffect(() => {
  const userInfo = getUserInfoFromStorage();
  
  if (userInfo) {
    console.log("UserContext! User info loaded from localStorage:", userInfo);
    dispatch({ type: USER_AUTH.LOGIN_SUCCESS, payload: userInfo });
  } else {
    // حذف یا بهینه سازی لاگ در صورت عدم وجود اطلاعات
    console.log("UserContext! No user info found in localStorage.");
  }
}, []);


  // Set Axios authorization header
  useEffect(() => {
    const { userInfo } = state.userLogin;
    if (userInfo?.token) {
      const interceptor = axios.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
        return config;
      });
      return () => axios.interceptors.request.eject(interceptor);
    }
  }, [state.userLogin]);

  const logoutUser = useCallback(() => {
    clearUserInfoFromStorage();
    dispatch({ type: USER_AUTH.LOGOUT });
    logout(dispatch);
  }, [dispatch]);

  // Handle token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      const { userInfo } = state.userLogin;
      if (userInfo?.token && userInfo.tokenExpiration) {
        const tokenExpiration = new Date(userInfo.tokenExpiration).getTime();
        if (Date.now() >= tokenExpiration) {
          logoutUser();
          setError("Session expired. Please log in again.");
        }
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [state.userLogin, logoutUser]);

  // Register user action
  const registerUser = useCallback(
    async (name, email, password) => {
      try {
        const response = await register(name, email, password, dispatch);
        saveUserInfoToStorage(response);
        dispatch({ type: USER_AUTH.LOGIN_SUCCESS, payload: response });
      } catch (error) {
        const errorMessage = handleError(error, "Failed to register user");
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [dispatch]
  );

  // Get user details action
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

  // Login user action
  const loginUser = useCallback(
    async (email, password) => {
      try {
        dispatch({ type: USER_AUTH.LOGIN_REQUEST });
        const response = await login(email, password, dispatch);
        saveUserInfoToStorage(response);
        dispatch({ type: USER_AUTH.LOGIN_SUCCESS, payload: response });
      } catch (error) {
        const errorMessage = handleError(error, "Failed to login user");
        dispatch({ type: USER_AUTH.LOGIN_FAIL, payload: errorMessage });
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [dispatch]
  );

  // Update user profile action
  const updateUserProfile = useCallback(
    async (user) => {
      try {
        dispatch({ type: USER_PROFILE_UPDATE.REQUEST });
        const response = await updateProfile(user, dispatch);
        saveUserInfoToStorage(response);
        dispatch({ type: USER_PROFILE_UPDATE.SUCCESS, payload: response });
      } catch (error) {
        const errorMessage = handleError(error, "Failed to update profile");
        dispatch({ type: USER_PROFILE_UPDATE.FAIL, payload: errorMessage });
        setError(errorMessage);
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
        updateUserProfile,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
