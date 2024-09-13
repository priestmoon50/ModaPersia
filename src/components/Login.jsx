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
  const { state, loginUser, loadUserFromStorage } = useContext(UserContext);
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

  // بررسی و اعتبارسنجی توکن در بارگذاری اولیه صفحه
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // هدایت کاربر به صفحه اصلی در صورتی که لاگین کرده باشد
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/products"); // هدایت به صفحه محصولات یا صفحه مورد نظر
    }
  }, [isLoggedIn, navigate]);

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
      if (response) {
        toast.success("Login successful!");
        navigate("/", { replace: true });

        // ذخیره نام کاربری در صورت انتخاب Remember Me
        if (loginState.rememberMe) {
          localStorage.setItem("savedUsername", data.username);
        } else {
          localStorage.removeItem("savedUsername");
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoginState((prev) => ({ ...prev, loading: false }));
    }
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

        {!isLoggedIn && (
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
