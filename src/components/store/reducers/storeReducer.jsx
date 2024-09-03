import {
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_UPDATE_DELIVERED_REQUEST,
  ORDER_UPDATE_DELIVERED_SUCCESS,
  ORDER_UPDATE_DELIVERED_FAIL,
} from "../constants/orderConstants";

const getCartItems = () => {
  const storedCartItems = localStorage.getItem("cartItems");
  if (!storedCartItems) return [];

  try {
    return JSON.parse(storedCartItems);
  } catch (e) {
    console.error("Error parsing cartItems from localStorage", e);
    localStorage.removeItem("cartItems"); // پاک کردن داده‌های نامعتبر
    return [];
  }
};

const handleRequestState = (statePart, action, loading = false, success = false, error = null) => ({
  ...statePart,
  loading,
  success,
  error: error ? action.payload : null,
});

const initialState = {
  cart: {
    cartItems: getCartItems(),
  },
  orderList: {
    orders: [],
    loading: false,
    error: null,
  },
  orderCreate: {
    order: null,
    loading: false,
    error: null,
    success: false,
  },
  orderDetails: {
    order: null,
    loading: false,
    error: null,
  },
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    // Cart actions
    case "ADD_TO_CART": {
      const item = action.payload;
      const existItem = state.cart.cartItems.find(
        (x) => x.product === item.product
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          )
        : [...state.cart.cartItems, item];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }
    case "REMOVE_FROM_CART": {
      const updatedCartItems = state.cart.cartItems.filter(
        (item) => item.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: updatedCartItems,
        },
      };
    }
    case "RESET_CART":
      localStorage.removeItem("cartItems");
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
        },
      };

    // Order actions
    case ORDER_LIST_REQUEST:
    case ORDER_DELETE_REQUEST:
      return {
        ...state,
        orderList: handleRequestState(state.orderList, action, true),
      };
    case ORDER_LIST_SUCCESS:
      return {
        ...state,
        orderList: handleRequestState(state.orderList, action, false, true),
        orders: action.payload,
      };
    case ORDER_LIST_FAIL:
    case ORDER_DELETE_FAIL:
      return {
        ...state,
        orderList: handleRequestState(state.orderList, action, false, false, true),
      };
    case ORDER_DELETE_SUCCESS:
      return {
        ...state,
        orderList: {
          ...handleRequestState(state.orderList, action, false, true),
          orders: state.orderList.orders.filter(
            (order) => order._id !== action.payload
          ),
        },
      };
    case ORDER_CREATE_REQUEST:
      return {
        ...state,
        orderCreate: handleRequestState(state.orderCreate, action, true),
      };
    case ORDER_CREATE_SUCCESS:
      return {
        ...state,
        orderCreate: {
          ...handleRequestState(state.orderCreate, action, false, true),
          order: action.payload,
        },
      };
    case ORDER_CREATE_FAIL:
      return {
        ...state,
        orderCreate: handleRequestState(state.orderCreate, action, false, false, true),
      };
    case ORDER_DETAILS_REQUEST:
    case ORDER_UPDATE_DELIVERED_REQUEST:
      return {
        ...state,
        orderDetails: handleRequestState(state.orderDetails, action, true),
      };
    case ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        orderDetails: {
          ...handleRequestState(state.orderDetails, action, false, true),
          order: action.payload,
        },
      };
    case ORDER_UPDATE_DELIVERED_SUCCESS:
      return {
        ...state,
        orderDetails: {
          ...handleRequestState(state.orderDetails, action, false, true),
          order: {
            ...state.orderDetails.order,
            isDelivered: true,
            deliveredAt: action.payload.deliveredAt,
          },
        },
      };
    case ORDER_DETAILS_FAIL:
    case ORDER_UPDATE_DELIVERED_FAIL:
      return {
        ...state,
        orderDetails: handleRequestState(state.orderDetails, action, false, false, true),
      };

    default:
      return state;
  }
};

export { initialState, storeReducer };
