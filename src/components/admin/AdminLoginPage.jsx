import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { AdminContext } from "../store/AdminContext"; // تغییر از StoreContext به AdminContext

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useContext(AdminContext); // استفاده از AdminContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await loginAdmin(email, password);
      navigate("/admin/dashboard"); // هدایت به صفحه داشبورد پس از ورود موفقیت‌آمیز
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      await loginAdmin("Admin@yahoo.com", "Admin123");
      navigate("/admin/dashboard"); // هدایت به صفحه داشبورد پس از ورود موفقیت‌آمیز
    } catch (error) {
      setError("Quick login failed");
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <Button
          onClick={handleQuickLogin}
          variant="contained"
          color="secondary"
          sx={{ mt: 2, ml: 2 }}
          disabled={loading}
        >
          {loading ? 'Quick Logging in...' : 'Quick Login'}
        </Button>
      </Box>
    </Container>
  );
};

export default AdminLoginPage;
