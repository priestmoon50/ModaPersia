import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_ADD_REQUEST,
  PRODUCT_ADD_SUCCESS,
  PRODUCT_ADD_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
} from "../constants/productConstants";

const productInitialState = {
  productList: {
    products: [],
    loading: false,
    error: null,
  },
  productAdd: {
    loading: false,
    success: false,
    product: null,
    error: null,
  },
  productUpdate: {
    loading: false,
    success: false,
    product: null,
    error: null,
  },
  productDelete: {
    loading: false,
    success: false,
    error: null,
  },
};

// Helper to update product list
const updateProductList = (products, updatedProduct) =>
  products.map((product) => (product._id === updatedProduct._id ? updatedProduct : product));

// Helper to handle success state updates
const handleSuccess = (state, key, data) => ({
  ...state,
  [key]: {
    ...state[key],
    loading: false,
    success: true,
    ...data,
  },
});

// Helper to handle fail state updates
const handleFail = (state, key, error) => {
  console.error(`[${new Date().toISOString()}] Error in ${key}:`, error);
  return {
    ...state,
    [key]: {
      ...state[key],
      loading: false,
      success: false,
      error,
    },
  };
};

const productReducer = (state = productInitialState, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return {
        ...state,
        productList: { ...state.productList, loading: true },
      };
    case PRODUCT_LIST_SUCCESS:
      return handleSuccess(state, "productList", { products: action.payload, error: null });
    case PRODUCT_LIST_FAIL:
      return handleFail(state, "productList", action.payload);

    case PRODUCT_ADD_REQUEST:
      return {
        ...state,
        productAdd: { ...state.productAdd, loading: true },
      };
    case PRODUCT_ADD_SUCCESS:
      return {
        ...handleSuccess(state, "productAdd", { product: action.payload }),
        productList: {
          ...state.productList,
          products: [...state.productList.products, action.payload],
        },
      };
    case PRODUCT_ADD_FAIL:
      return handleFail(state, "productAdd", action.payload);

    case PRODUCT_UPDATE_REQUEST:
      return {
        ...state,
        productUpdate: { ...state.productUpdate, loading: true },
      };
    case PRODUCT_UPDATE_SUCCESS:
      return {
        ...handleSuccess(state, "productUpdate", { product: action.payload }),
        productList: {
          ...state.productList,
          products: updateProductList(state.productList.products, action.payload),
        },
      };
    case PRODUCT_UPDATE_FAIL:
      return handleFail(state, "productUpdate", action.payload);

    case PRODUCT_DELETE_REQUEST:
      return {
        ...state,
        productDelete: { ...state.productDelete, loading: true },
      };
    case PRODUCT_DELETE_SUCCESS:
      return {
        ...handleSuccess(state, "productDelete", { error: null }),
        productList: {
          ...state.productList,
          products: state.productList.products.filter((product) => product._id !== action.payload),
        },
      };
    case PRODUCT_DELETE_FAIL:
      return handleFail(state, "productDelete", action.payload);

    default:
      return state;
  }
};

export { productInitialState, productReducer };
