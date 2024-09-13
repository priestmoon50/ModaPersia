import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { USER_AUTH } from "./constants/userConstants";
import { userReducer, userInitialState } from "./reducers/userReducer";
import {
  login,  // تغییر به استفاده از اکشن login از userActions.jsx
  logout, // استفاده از اکشن logout
  register, // استفاده از اکشن register
  getUserDetails,
  updateProfile,
} from "./actions/userActions"; // اکشن‌ها را وارد کنید

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

// Load user info from localStorage on initial load
useEffect(() => {
  const userInfo = getUserInfoFromStorage();
  
  if (userInfo) {
    console.log("UserContext:before ditpatch User info loaded from localStorage:", userInfo); // لاگ گرفتن از اطلاعات کاربر
    dispatch({ type: USER_AUTH.LOGIN_SUCCESS, payload: userInfo });

    
 // اضافه کردن توکن به هدر
    axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
    console.log("UserContext!after dispatch User info loaded from localStorage:", userInfo);
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
    logout(dispatch); // فراخوانی اکشن logout
  }, [dispatch]);

  // Handle token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      const { userInfo } = state.userLogin;
      if (userInfo?.token && userInfo.tokenExpiration) {
        const tokenExpiration = new Date(userInfo.tokenExpiration).getTime();
        const now = Date.now();
        const timeRemaining = tokenExpiration - now;
        if (timeRemaining <= 0) {
          logoutUser();
          setError("Session expired. Please log in again.");
        } else {
          setTimeout(() => {
            logoutUser();
            setError("Session expired. Please log in again.");
          }, timeRemaining);
        }
      }
    };
  
    checkTokenExpiration();
  }, [state.userLogin, logoutUser]);
  

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

 // اکشن loginUser به عنوان login از userActions استفاده می‌شود
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
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
