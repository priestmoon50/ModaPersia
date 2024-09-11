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
  const user = userLogin?.userInfo;
  const isLoggedIn = !!user;

  // مدیریت حالت‌های محلی (Local State)
  const [loginState, setLoginState] = useState({
    showPassword: false,
    rememberMe: false,
    showForgetPassword: false,
    loading: false,
  });

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
    if (token) {
      const checkTokenValidity = async () => {
        try {
          setLoginState((prev) => ({ ...prev, loading: true }));
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
        // به جای ذخیره توکن در LocalStorage، توکن در کوکی HttpOnly ذخیره می‌شود
        document.cookie = `authToken=${response.token}; HttpOnly; Secure; SameSite=Strict`;
      }

      if (loginState.rememberMe) {
        localStorage.setItem("savedUsername", data.username);
      } else {
        localStorage.removeItem("savedUsername");
      }

      toast.success("Login successful!");
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid username or password";
      toast.error(errorMessage);
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
        <ForgetPassword />
      </Modal>

      <ToastContainer />
    </Container>
  );
}
