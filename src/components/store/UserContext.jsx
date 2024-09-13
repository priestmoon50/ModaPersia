import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import axios from "axios";
import { USER_AUTH } from "./constants/userConstants";
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

// User Provider
const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, userInitialState);
  const [error, setError] = useState(null);
  const logoutTimerRef = useRef(null); // استفاده از useRef برای ذخیره logoutTimer

  // تابع loadUserFromStorage
  const loadUserFromStorage = useCallback(() => {
    const userInfo = getUserInfoFromStorage();
    if (userInfo) {
      dispatch({ type: USER_AUTH.LOGIN_SUCCESS, payload: userInfo });
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
    }
  }, [dispatch]);

  // Load user info from localStorage on initial load
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

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
    logout(dispatch);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current); // پاک کردن تایمر
    }
  }, [dispatch]);

  // Handle token expiration
  useEffect(() => {
    const { userInfo } = state.userLogin;
    if (userInfo?.token && userInfo.tokenExpiration) {
      const tokenExpiration = new Date(userInfo.tokenExpiration).getTime();
      const now = Date.now();
      const timeRemaining = tokenExpiration - now;
      if (timeRemaining <= 0) {
        logoutUser();
        setError("Session expired. Please log in again.");
      } else {
        logoutTimerRef.current = setTimeout(() => {
          logoutUser();
          setError("Session expired. Please log in again.");
        }, timeRemaining);
      }
    }
  }, [state.userLogin, logoutUser]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Register user action
  const registerUser = useCallback(async (name, email, password) => {
    try {
      await register(name, email, password, dispatch);
    } catch (error) {
      setError("Registration failed");
    }
  }, [dispatch]);

  // Get user details action
  const getUserDetailsAction = useCallback(async (id) => {
    try {
      await getUserDetails(id, dispatch);
    } catch (error) {
      setError("Failed to fetch user details");
    }
  }, [dispatch]);

  // Login user action
  const loginUser = useCallback(async (email, password) => {
    try {
      await login(email, password, dispatch);
    } catch (error) {
      setError("Login failed");
      console.error("Login error:", error);
    }
  }, [dispatch]);

  // Update user profile action
  const updateUserProfile = useCallback(async (user) => {
    try {
      await updateProfile(user, dispatch);
    } catch (error) {
      setError("Failed to update profile");
    }
  }, [dispatch]);

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
        loadUserFromStorage, // اضافه کردن تابع loadUserFromStorage به Provider
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
