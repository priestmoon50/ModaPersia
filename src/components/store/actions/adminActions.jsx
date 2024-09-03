import axios from "axios";
import {
  ADMIN_LOGIN_REQUEST,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGOUT,
} from "../constants/adminConstants";

// Login Admin
export const adminLogin = async (email, password, dispatch) => {
  try {
    dispatch({ type: ADMIN_LOGIN_REQUEST });

    const { data } = await axios.post("/api/admin/login", { email, password });

    // ذخیره‌سازی اطلاعات ادمین و ارسال اکشن موفقیت
    const adminData = { ...data, isAdmin: true };
    dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: adminData });
    localStorage.setItem("userInfo", JSON.stringify(adminData));

    return adminData; // بازگرداندن اطلاعات برای استفاده بعدی
  } catch (error) {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
 
    dispatch({
      type: ADMIN_LOGIN_FAIL,
      payload: errorMessage,
    });

    throw error; // بازگرداندن خطا برای مدیریت بعدی
  }
};

// Logout Admin
export const adminLogout = (dispatch) => {
  // پاک کردن اطلاعات ادمین از localStorage
  localStorage.removeItem("userInfo");

  // ارسال اکشن خروج
  dispatch({ type: ADMIN_LOGOUT });
};
