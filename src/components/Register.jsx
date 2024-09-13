import React, { useState, useContext } from "react"; 
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
  Box,
  IconButton,
  CircularProgress,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserContext } from "./store/UserContext";

// Validation schema
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[A-Za-z]+$/, "Name should contain only letters")
    .min(5, "Name must be at least 5 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain letters")
    .matches(/[0-9]/, "Password must contain numbers"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { registerUser } = useContext(UserContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Function to toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Check name and email availability
  const checkAvailability = async (field, value) => {
    setIsCheckingAvailability(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/auth/check-${field}?${field}=${value}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error(`Error checking ${field}`);

      const { exists } = await response.json();
      if (field === "name") {
        setNameError(exists ? "Name is already taken" : null);
      } else {
        setEmailError(exists ? "Email is already in use" : null);
      }
    } catch {
      field === "name"
        ? setNameError("Error checking name availability")
        : setEmailError("Error checking email availability");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const onSubmit = async (data) => {
    // Check if name and email are available after clicking submit
    await checkAvailability("name", data.name.toLowerCase());
    await checkAvailability("email", data.email.toLowerCase());

    if (nameError || emailError) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await registerUser(
        data.name.toLowerCase(),
        data.email.toLowerCase(),
        data.password
      );

      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response));

      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Error registering user");
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
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          color={theme.palette.text.primary}
        >
          Register
        </Typography>

        {(Object.keys(errors).length > 0 || nameError || emailError) && (
          <Box
            sx={{
              p: 2,
              bgcolor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
              borderRadius: 1,
              mb: 2,
            }}
          >
            {errors.name && <Typography>{errors.name.message}</Typography>}
            {errors.email && <Typography>{errors.email.message}</Typography>}
            {errors.password && (
              <Typography>{errors.password.message}</Typography>
            )}
            {errors.confirmPassword && (
              <Typography>{errors.confirmPassword.message}</Typography>
            )}
            {nameError && <Typography>{nameError}</Typography>}
            {emailError && <Typography>{emailError}</Typography>}
          </Box>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Name"
            {...register("name")}
            error={!!errors.name || !!nameError}
            helperText={errors.name?.message || nameError}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            {...register("email")}
            error={!!errors.email || !!emailError}
            helperText={errors.email?.message || emailError}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={toggleConfirmPasswordVisibility}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isCheckingAvailability}
            sx={{ mt: 2 }}
          >
            {isCheckingAvailability ? (
              <CircularProgress size={24} />
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default Register;
