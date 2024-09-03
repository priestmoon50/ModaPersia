import {
    ADMIN_LOGIN_REQUEST,
    ADMIN_LOGIN_SUCCESS,
    ADMIN_LOGIN_FAIL,
    ADMIN_LOGOUT,
  } from "../constants/adminConstants";
  
  const initialAdminState = {
    adminLogin: {
      adminInfo: null,
      loading: false,
      error: null,
    },
  };
  
  const adminReducer = (state = initialAdminState, action) => {
    switch (action.type) {
      case ADMIN_LOGIN_REQUEST:
        return {
          ...state,
          adminLogin: {
            ...state.adminLogin,
            loading: true,
            error: null, // پاک کردن خطا هنگام درخواست
          },
        };
      case ADMIN_LOGIN_SUCCESS:
        return {
          ...state,
          adminLogin: {
            ...state.adminLogin,
            loading: false,
            adminInfo: action.payload,
            error: null,
          },
        };
      case ADMIN_LOGIN_FAIL:
        return {
          ...state,
          adminLogin: {
            ...state.adminLogin,
            loading: false,
            error: action.payload,
          },
        };
      case ADMIN_LOGOUT:
        return {
          ...state,
          adminLogin: {
            adminInfo: null,
            loading: false,
            error: null,
          },
        };
      default:
        return state;
    }
  };
  
  export { adminReducer, initialAdminState };
  