import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from '@mui/material/styles';
import { Button, TextField, Typography, Box, CircularProgress } from "@mui/material";

export default function ForgetPassword() {
  const theme = useTheme(); // استفاده از تم برای تغییرات استایل
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email("ایمیل معتبر نیست").required("ایمیل ضروری است"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      if (!response.ok) {
        throw new Error("ارسال ایمیل با خطا مواجه شد");
      }

      setEmailSent(true);
      toast.success("ایمیل بازیابی رمز عبور ارسال شد");
    } catch (error) {
      console.error("Forget password error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: theme.palette.mode === 'dark' ? 'rgba(28, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: '400px',
        margin: 'auto'
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center" color={theme.palette.text.primary}>
          فراموشی رمز عبور
        </Typography>

        {emailSent ? (
          <Typography variant="body1" align="center" color={theme.palette.text.primary}>
            لطفاً ایمیل خود را بررسی کنید
          </Typography>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="ایمیل"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              margin="normal"
              color="primary"
              InputLabelProps={{
                style: { direction: 'rtl' }
              }}
              sx={{ direction: 'rtl' }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "ارسال"}
            </Button>
          </form>
        )}
      </Box>

      <ToastContainer />
    </Box>
  );
}
