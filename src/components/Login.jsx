import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import ForgetPassword from "./ForgetPassword";
import { UserContext } from "./store/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { state, loginUser, logoutUser, verifyToken } = useContext(UserContext); // Add verifyToken function from context
  const { userLogin } = state; // Get userLogin state from UserContext
  const user = userLogin?.userInfo;
  const isLoggedIn = !!user;

  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    username: yup.string().required("نام کاربری ضروری است"),
    password: yup.string().required("رمز عبور ضروری است"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // اعتبارسنجی توکن در هنگام بارگذاری صفحه
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const checkTokenValidity = async () => {
        try {
          const isValid = await verifyToken(token); // بررسی اعتبار توکن
          if (!isValid) {
            logoutUser(); // اگر توکن معتبر نباشد، کاربر از سیستم خارج شود
            toast.error("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
            navigate("/login");
          }
        } catch (error) {
          console.error("خطا در اعتبارسنجی توکن:", error);
          logoutUser();
          toast.error("خطا در اعتبارسنجی توکن. لطفاً دوباره وارد شوید.");
          navigate("/login");
        }
      };
      checkTokenValidity();
    }
  }, [navigate, logoutUser, verifyToken]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedUsername && savedPassword) {
      setValue("username", savedUsername);
      setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await loginUser(data.username, data.password);

      if (response && response.token) {
        localStorage.setItem("authToken", response.token); // ذخیره توکن در localStorage
      }

      if (rememberMe) {
        localStorage.setItem("savedUsername", data.username);
        localStorage.setItem("savedPassword", data.password);
      } else {
        localStorage.removeItem("savedUsername");
        localStorage.removeItem("savedPassword");
      }

      navigate("/profile");
    } catch (error) {
      console.error("خطا در ورود:", error);
      const errorMessage =
        error.response?.data?.message || "نام کاربری یا رمز عبور اشتباه است";
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    toast.success("با موفقیت خارج شدید.");
  };

  return (
    <div className="login-box">
      {isLoading && <div className="loading-spinner">در حال بارگذاری...</div>}
      <div className="Login">
        <h2>ورود</h2>
        {isLoggedIn ? (
          <div>
            <p>شما با نام {user?.username} وارد شده‌اید. لطفا ابتدا خارج شوید.</p>
            <button onClick={handleLogout} className="gaming-button">
              خروج
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <div className="input-container">
                <i className="fas fa-user icon"></i>
                <input
                  type="text"
                  {...register("username")}
                  placeholder="نام کاربری"
                  className={errors.username ? "error" : ""}
                />
                {errors.username && <p>{errors.username.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <i className="fas fa-lock icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="رمز عبور"
                  className={errors.password ? "error" : ""}
                />
                <i
                  className={`fas ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  } password-toggle-icon`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
                {errors.password && <p>{errors.password.message}</p>}
              </div>
            </div>

            <div className="form-group remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe">مرا به خاطر بسپار</label>
            </div>

            <button type="submit" className="gaming-button">
              ورود
            </button>

            <div className="button-group">
              <button
                type="button"
                className="gaming-button register-button"
                onClick={() => navigate("/Register")}
              >
                ثبت‌نام
              </button>
              <button
                type="button"
                className="gaming-button forget-password-button"
                onClick={() => setShowForgetPassword(true)}
              >
                فراموشی رمز عبور؟
              </button>
            </div>
          </form>
        )}
      </div>

      {showForgetPassword && <ForgetPassword />}
      <ToastContainer />
      {loginError && <p className="error">{loginError}</p>}
    </div>
  );
}
