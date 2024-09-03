import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { UserContext } from "./store/UserContext"; // Import UserContext
import _ from "lodash";

export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useContext(UserContext); // Use registerUser from UserContext
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const schema = yup.object().shape({
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const name = watch("name");
  const email = watch("email");

  useEffect(() => {
    const debouncedCheckAvailability = _.debounce(async (field, value) => {
      setIsCheckingAvailability(true);
      try {
        const response = await fetch(
          `http://localhost:3001/api/auth/check-${field}?${field}=${value}`
        );
        if (!response.ok) {
          throw new Error(
            `Error checking ${field === "name" ? "name" : "email"}`
          );
        }
        const data = await response.json();
        if (data.exists) {
          field === "name"
            ? setNameError("Name is already taken")
            : setEmailError("Email is already in use");
        } else {
          field === "name" ? setNameError(null) : setEmailError(null);
        }
      } catch (error) {
        console.error(
          `${field === "name" ? "Name" : "Email"} check error:`,
          error
        );
        field === "name"
          ? setNameError("Error checking name availability")
          : setEmailError("Error checking email availability");
      } finally {
        setIsCheckingAvailability(false);
      }
    }, 500);

    if (name) debouncedCheckAvailability("name", name.toLowerCase());
    if (email) debouncedCheckAvailability("email", email.toLowerCase());
  }, [name, email]);

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(
        data.name.toLowerCase(),
        data.email.toLowerCase(),
        data.password
      );

      // اطمینان حاصل کنید که اطلاعات صحیح JSON.stringify شده باشد
      localStorage.setItem("userInfo", JSON.stringify(response));

      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Error registering user");
    }
  };

  return (
    <div className="login-box">
      <div className="Login">
        <h2>Register</h2>
        {Object.keys(errors).length > 0 && (
          <div className="errors-container">
            <i className="fas fa-exclamation-triangle icon"></i>
            <div>
              {errors.name && <p>{errors.name.message}</p>}
              {errors.email && <p>{errors.email.message}</p>}
              {errors.password && <p>{errors.password.message}</p>}
              {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
              {nameError && <p>{nameError}</p>}
              {emailError && <p>{emailError}</p>}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <div className="input-container">
              <i className="fas fa-user icon"></i>
              <input
                type="text"
                {...register("name")}
                placeholder="Name"
                className={errors.name || nameError ? "error" : ""}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <i className="fas fa-envelope icon"></i>
              <input
                type="email"
                {...register("email")}
                placeholder="Email"
                className={errors.email || emailError ? "error" : ""}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <i className="fas fa-lock icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className={errors.password ? "error" : ""}
                required
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } password-toggle-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <i className="fas fa-lock icon"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                className={errors.confirmPassword ? "error" : ""}
                required
              />
              <i
                className={`fas ${
                  showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                } password-toggle-icon`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
          </div>

          <button type="submit" disabled={isCheckingAvailability}>
            {isCheckingAvailability ? "Checking..." : "Register"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
