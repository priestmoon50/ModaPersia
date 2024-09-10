import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Checkbox,
  TextField,
  Typography,
  Container,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ForgetPassword from "./ForgetPassword";
import { UserContext } from "./store/UserContext";

export default function Login() {
  const theme = useTheme(); // دسترسی به تم
  const navigate = useNavigate();
  const { state, loginUser, logoutUser, verifyToken } = useContext(UserContext);
  const { userLogin } = state;
  const user = userLogin?.userInfo;
  const isLoggedIn = !!user;

  // استفاده از یک شیء برای مدیریت حالت‌ها
  const [loginState, setLoginState] = useState({
    showPassword: false,
    rememberMe: false,
    showForgetPassword: false,
  });

  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // اعتبارسنجی توکن در بارگذاری صفحه
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const checkTokenValidity = async () => {
        try {
          const isValid = await verifyToken(token);
          if (!isValid) {
            logoutUser();
            toast.error("Your session has expired. Please log in again.");
            navigate("/login");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          logoutUser();
          toast.error("Error validating token. Please log in again.");
          navigate("/login");
        }
      };
      checkTokenValidity();
    }
  }, [navigate, logoutUser, verifyToken]);

  // بارگذاری اطلاعات ذخیره‌شده در حافظه
  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedUsername && savedPassword) {
      setValue("username", savedUsername);
      setValue("password", savedPassword);
      setLoginState((prevState) => ({
        ...prevState,
        rememberMe: true,
      }));
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.username, data.password);
      if (response && response.token) {
        localStorage.setItem("authToken", response.token);
      }

      if (loginState.rememberMe) {
        localStorage.setItem("savedUsername", data.username);
        localStorage.setItem("savedPassword", data.password);
      } else {
        localStorage.removeItem("savedUsername");
        localStorage.removeItem("savedPassword");
      }

      // جلوگیری از بازگشت به صفحه ورود
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid username or password";
      toast.error(errorMessage);
    }
  };

  const handleLogout = () => {
    logoutUser();
    toast.success("Successfully logged out.");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(/path/to/your/image.png)`,
        backgroundSize: "cover",
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(28, 28, 28, 0.7)"
              : "rgba(255, 255, 255, 0.8)",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          border:
            theme.palette.mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.2)"
              : "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        {isSubmitting && <CircularProgress />}
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          color={theme.palette.text.primary}
        >
          Login
        </Typography>

        {isLoggedIn ? (
          <Box>
            <Typography variant="body1" color={theme.palette.text.primary}>
              You are logged in as {user?.username}. Please log out first.
            </Typography>
            <Button onClick={handleLogout} variant="contained" sx={{ mt: 2 }}>
              Logout
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Username"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              fullWidth
              margin="normal"
              color="primary"
            />

            <TextField
              label="Password"
              type={loginState.showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() =>
                      setLoginState((prevState) => ({
                        ...prevState,
                        showPassword: !prevState.showPassword,
                      }))
                    }
                    edge="end"
                  >
                    {loginState.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Box display="flex" alignItems="center" mb={2}>
              <Checkbox
                checked={loginState.rememberMe}
                onChange={() =>
                  setLoginState((prevState) => ({
                    ...prevState,
                    rememberMe: !prevState.rememberMe,
                  }))
                }
              />
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Remember me
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              disabled={isSubmitting}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/Register")}
            >
              Register
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={() =>
                setLoginState((prevState) => ({
                  ...prevState,
                  showForgetPassword: true,
                }))
              }
              sx={{ mt: 1 }}
            >
              Forgot Password?
            </Button>
          </form>
        )}
      </Box>

      {loginState.showForgetPassword && <ForgetPassword />}
      <ToastContainer />
    </Container>
  );
}
