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
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
} from "../constants/userConstants";

// وضعیت اولیه `userInitialState`
const userInitialState = {
  userLogin: {
    userInfo: null, // مقدار پیش‌فرض null
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

  userProfileUpdate: {
    loading: false,
    success: false,
    error: null,
  },
};


// تعریف `userReducer` برای مدیریت اکشن‌های مربوط به کاربر
const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    // Login و Register هر دو مشابه هستند، پس ترکیب می‌کنیم
    case USER_LOGIN_REQUEST:
    case USER_REGISTER_REQUEST:
      return {
        ...state,
        [action.type === USER_LOGIN_REQUEST ? "userLogin" : "userRegister"]: {
          loading: true,
          error: null,
          userInfo: null,
        },
      };

    // موفقیت در Login و Register
    case USER_LOGIN_SUCCESS:
    case USER_REGISTER_SUCCESS:
      return {
        ...state,
        [action.type === USER_LOGIN_SUCCESS ? "userLogin" : "userRegister"]: {
          loading: false,
          userInfo: action.payload,
          error: null,
        },
      };

    // شکست در Login و Register
    case USER_LOGIN_FAIL:
    case USER_REGISTER_FAIL:
      return {
        ...state,
        [action.type === USER_LOGIN_FAIL ? "userLogin" : "userRegister"]: {
          loading: false,
          error: action.payload,
          userInfo: null,
        },
      };

    // Logout کاربر
    case USER_LOGOUT:
      return {
        ...state,
        userLogin: {
          userInfo: null,
          loading: false,
          error: null,
        },
      };

    // درخواست، موفقیت و شکست در گرفتن جزئیات کاربر
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


      // افزودن اکشن‌های جدید
    case USER_UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        userProfileUpdate: {
          loading: true,
          success: false,
          error: null,
        },
      };
    case USER_UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        userProfileUpdate: {
          loading: false,
          success: true,
          error: null,
        },
      };
    case USER_UPDATE_PROFILE_FAIL:
      return {
        ...state,
        userProfileUpdate: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
};

export { userReducer, userInitialState };
