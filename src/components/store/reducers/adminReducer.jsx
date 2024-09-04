import {
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGOUT,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  DELETE_PRODUCT_SUCCESS,
  EDIT_PRODUCT_REQUEST,   // اضافه کردن ثابت‌ها
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILURE,
} from "../constants/adminConstants";

const initialAdminState = {
  adminLogin: {
    adminInfo: null,
    loading: false,
    error: null,
  },
  productList: {
    products: [],
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
          error: null,
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
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        productList: {
          ...state.productList,
          loading: true,
          error: null,
        },
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        productList: {
          products: action.payload,
          loading: false,
          error: null,
        },
      };
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        productList: {
          ...state.productList,
          loading: false,
          error: action.payload,
        },
      };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        productList: {
          ...state.productList,
          products: state.productList.products.filter(
            (product) => product._id !== action.payload
          ),
        },
      };

    // اضافه کردن عملیات ویرایش محصول
    case EDIT_PRODUCT_REQUEST:
      return {
        ...state,
        productList: {
          ...state.productList,
          loading: true,
          error: null,
        },
      };
    case EDIT_PRODUCT_SUCCESS:
      return {
        ...state,
        productList: {
          ...state.productList,
          loading: false,
          products: state.productList.products.map((product) =>
            product._id === action.payload._id ? action.payload : product
          ),
          error: null,
        },
      };
    case EDIT_PRODUCT_FAILURE:
      return {
        ...state,
        productList: {
          ...state.productList,
          loading: false,
          error: action.payload,
        },
      };
      
    default:
      return state;
  }
};

export { adminReducer, initialAdminState };
