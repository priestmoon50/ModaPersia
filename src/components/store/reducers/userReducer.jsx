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
  
  const getUserInfo = () => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (!storedUserInfo) return null;
  
    try {
      return JSON.parse(storedUserInfo);
    } catch (e) {
      console.error("Error parsing userInfo from localStorage", e);
      localStorage.removeItem("userInfo"); // پاک کردن داده‌های نامعتبر
      return null;
    }
  };
  
  // تعریف وضعیت اولیه با نام `userInitialState`
  const userInitialState = {
    userLogin: {
      userInfo: getUserInfo(),
      loading: false,
      error: null,
    },
    userRegister: {
      loading: false,
      userInfo: null,
      error: null,
    },
    userDetails: {
      loading: false,
      user: null,
      error: null,
    },
  };
  
  // تعریف `userReducer` برای مدیریت اکشن‌های مربوط به کاربر
  const userReducer = (state = userInitialState, action) => {
    switch (action.type) {
      case USER_LOGIN_REQUEST:
        return {
          ...state,
          userLogin: {
            ...state.userLogin,
            loading: true,
          },
        };
      case USER_LOGIN_SUCCESS:
        return {
          ...state,
          userLogin: {
            ...state.userLogin,
            loading: false,
            userInfo: action.payload,
            error: null,
          },
        };
      case USER_LOGIN_FAIL:
        return {
          ...state,
          userLogin: {
            ...state.userLogin,
            loading: false,
            error: action.payload,
          },
        };
      case USER_LOGOUT:
        localStorage.removeItem("userInfo");
        localStorage.removeItem("cartItems");
        return {
          ...state,
          userLogin: {
            userInfo: null,
            loading: false,
            error: null,
          },
        };
      case USER_REGISTER_REQUEST:
        return {
          ...state,
          userRegister: {
            ...state.userRegister,
            loading: true,
          },
        };
      case USER_REGISTER_SUCCESS:
        return {
          ...state,
          userRegister: {
            ...state.userRegister,
            loading: false,
            userInfo: action.payload,
            error: null,
          },
        };
      case USER_REGISTER_FAIL:
        return {
          ...state,
          userRegister: {
            ...state.userRegister,
            loading: false,
            error: action.payload,
          },
        };
      case USER_DETAILS_REQUEST:
        return {
          ...state,
          userDetails: {
            ...state.userDetails,
            loading: true,
          },
        };
      case USER_DETAILS_SUCCESS:
        return {
          ...state,
          userDetails: {
            ...state.userDetails,
            loading: false,
            user: action.payload,
            error: null,
          },
        };
      case USER_DETAILS_FAIL:
        return {
          ...state,
          userDetails: {
            ...state.userDetails,
            loading: false,
            error: action.payload,
          },
        };
      default:
        return state;
    }
  };
  
  export { userReducer, userInitialState };
  