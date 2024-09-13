import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import {
  Button,
  Checkbox,
  TextField,
  Typography,
  Container,
  Box,
  IconButton,
  CircularProgress,
  Modal,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ForgetPassword from "./ForgetPassword";
import { UserContext } from "./store/UserContext";

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { state, loginUser, logoutUser, verifyToken } = useContext(UserContext);
  const { userLogin } = state;
  console.log("Login component: userLogin state:", userLogin);
  const user = userLogin?.userInfo;
  const isLoggedIn = !!user;
  console.log("Login component: User info:", user);
  console.log("Login component: isLoggedIn:", isLoggedIn);
  // مدیریت حالت‌های محلی (Local State)
  const [loginState, setLoginState] = useState({
    showPassword: false,
    rememberMe: false,
    showForgetPassword: false,
    loading: false,
  });
  const [authToken, setAuthToken] = useState(null); // ایجاد setAuthToken
  // تنظیم توکن در درخواست‌های Axios پس از ورود کاربر
  useEffect(() => {
    if (authToken) {
      // اگر توکن موجود بود، آن را به عنوان هدر Authorization در axios قرار می‌دهیم
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    }
  }, [authToken]);

  // اعتبارسنجی فرم با استفاده از yup
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

  // اعتبارسنجی توکن JWT در بارگذاری اولیه صفحه
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Loin component : JWT token in localStorage:", token);
    if (token) {
      const checkTokenValidity = async () => {
        try {
          setLoginState((prev) => ({ ...prev, loading: true }));
          const isValid = await verifyToken(token);
          console.log("Loin component : Token validity:", isValid);
          if (isValid) {
            // هدایت به صفحه پروفایل اگر توکن معتبر است
            navigate("/profile", { replace: true });
          } else {
            logoutUser();
            toast.error("Your session has expired. Please log in again.");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          logoutUser();
          toast.error("Error validating token. Please log in again.");
        } finally {
          setLoginState((prev) => ({ ...prev, loading: false }));
        }
      };
      checkTokenValidity();
    }
  }, [navigate, logoutUser, verifyToken]);

  // بارگذاری اطلاعات ذخیره‌شده در حافظه
  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    if (savedUsername) {
      setValue("username", savedUsername);
      setLoginState((prevState) => ({
        ...prevState,
        rememberMe: true,
      }));
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setLoginState((prev) => ({ ...prev, loading: true }));

      const response = await loginUser(data.username, data.password);

      if (response && response.token) {
        // ذخیره توکن در state (برای استفاده سریع)
        setAuthToken(response.token);

        // ذخیره توکن در localStorage (برای استفاده بعدی)
        localStorage.setItem("authToken", response.token);

        // ذخیره refresh token در کوکی HTTP-Only سمت سرور
        document.cookie = `refreshToken=${response.refreshToken}; HttpOnly; Secure; SameSite=Strict`;

        // هدایت به صفحه پروفایل
        toast.success("Login successful!");
        navigate("/profile", { replace: true });
      }

      if (loginState.rememberMe) {
        localStorage.setItem("savedUsername", data.username);
      } else {
        localStorage.removeItem("savedUsername");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoginState((prev) => ({ ...prev, loading: false }));
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
        position: "relative",
      }}
    >
      {loginState.loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

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
                    {loginState.showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
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
              disabled={isSubmitting || loginState.loading}
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

      {/* Modal for Forget Password */}
      <Modal
        open={loginState.showForgetPassword}
        onClose={() =>
          setLoginState((prevState) => ({
            ...prevState,
            showForgetPassword: false,
          }))
        }
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <ForgetPassword />
        </Box>
      </Modal>

      <ToastContainer />
    </Container>
  );
}
