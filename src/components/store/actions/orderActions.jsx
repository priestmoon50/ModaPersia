import axios from "axios";
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
  ORDER_DELETE_FAIL,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_REQUEST,
  ORDER_UPDATE_DELIVERED_REQUEST,
  ORDER_UPDATE_DELIVERED_SUCCESS,
  ORDER_UPDATE_DELIVERED_FAIL,
} from "../constants/orderConstants";

// ایجاد نمونه‌ای از axios با تنظیمات پایه
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// افزودن توکن به درخواست‌ها
axiosInstance.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    try {
      const token = JSON.parse(userInfo).token;  // استخراج توکن از اطلاعات کاربر
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Error parsing userInfo from localStorage", e);
    }
  }
  return config;
});

// مدیریت خطا
const handleRequestError = (error, failType, dispatch) => {
  let errorMessage = error.message;

  if (error.response) {
    errorMessage = error.response.data?.message || error.response.statusText;
  } else if (error.request) {
    errorMessage = "Network error, please try again later.";
  }

  dispatch({
    type: failType,
    payload: errorMessage,
  });
};

// تابع عمومی برای انجام درخواست‌ها
const executeRequest = async (dispatch, requestType, successType, failType, method, url, data = {}) => {
  try {
    dispatch({ type: requestType });

    let response;
    if (method === "get" || method === "delete") {
      response = await axiosInstance[method](url);
    } else {
      response = await axiosInstance[method](url, data);
    }

    dispatch({ type: successType, payload: response.data });
  } catch (error) {
    handleRequestError(error, failType, dispatch);
  }
};

// لیست سفارشات
export const listOrders = (dispatch) => 
  executeRequest(dispatch, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_LIST_FAIL, "get", "/api/orders");

// جزئیات سفارش
export const fetchOrderDetails = (id, dispatch) => 
  executeRequest(dispatch, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL, "get", `/api/orders/${id}`);

// ایجاد سفارش
export const createOrder = (orderData, dispatch) => 
  executeRequest(dispatch, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_CREATE_FAIL, "post", "/api/orders", orderData);

// بروزرسانی وضعیت سفارش به تحویل شده
export const updateOrderToDeliveredAction = (id, dispatch) => 
  executeRequest(dispatch, ORDER_UPDATE_DELIVERED_REQUEST, ORDER_UPDATE_DELIVERED_SUCCESS, ORDER_UPDATE_DELIVERED_FAIL, "put", `/api/orders/${id}/deliver`);

// حذف سفارش
export const deleteOrderAction = (id, dispatch) => 
  executeRequest(dispatch, ORDER_DELETE_REQUEST, ORDER_DELETE_SUCCESS, ORDER_DELETE_FAIL, "delete", `/api/orders/${id}`);
