import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./store/UserContext";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
} from "@mui/material"; // Importing Material UI components

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const { state, getUserDetailsAction, updateUserProfile, error } = useContext(UserContext);
  const { userLogin, userDetails, userUpdateProfile = {} } = state;
  const { userInfo } = userLogin;
  const { loading, user } = userDetails;
  const { success = false } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.name || success) {
        getUserDetailsAction(userInfo._id);
      } else {
        setName(user.name);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
      }
    }
  }, [getUserDetailsAction, navigate, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {

      updateUserProfile({ id: user._id, name, email, phoneNumber, password });
    }
  };
  

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        پروفایل کاربر
      </Typography>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">پروفایل به‌روزرسانی شد</Message>}
      {loading ? (
        <Loader />
      ) : (
        <Box component="form" onSubmit={submitHandler}>
          <TextField
            label="نام"
            fullWidth
            margin="normal"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="ایمیل"
            fullWidth
            margin="normal"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="شماره تلفن"
            fullWidth
            margin="normal"
            value={phoneNumber || ""}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            label="رمز عبور"
            type="password"
            fullWidth
            margin="normal"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="تأیید رمز عبور"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword || ""}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3 }}
            fullWidth
          >
            به‌روزرسانی پروفایل
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ProfileScreen;
