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
import { useTheme } from '@mui/material/styles'; // Import useTheme for dynamic theming

const ProfileScreen = () => {
  const theme = useTheme(); // Accessing current theme
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
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: 4, 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(28, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" gutterBottom align="center" color={theme.palette.text.primary}>
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
            InputLabelProps={{ style: { direction: 'rtl' } }}
            sx={{ direction: 'rtl' }}
          />
          <TextField
            label="ایمیل"
            fullWidth
            margin="normal"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { direction: 'rtl' } }}
            sx={{ direction: 'rtl' }}
          />
          <TextField
            label="شماره تلفن"
            fullWidth
            margin="normal"
            value={phoneNumber || ""}
            onChange={(e) => setPhoneNumber(e.target.value)}
            InputLabelProps={{ style: { direction: 'rtl' } }}
            sx={{ direction: 'rtl' }}
          />
          <TextField
            label="رمز عبور"
            type="password"
            fullWidth
            margin="normal"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { direction: 'rtl' } }}
            sx={{ direction: 'rtl' }}
          />
          <TextField
            label="تأیید رمز عبور"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword || ""}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputLabelProps={{ style: { direction: 'rtl' } }}
            sx={{ direction: 'rtl' }}
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
