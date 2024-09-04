import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from './store/AdminContext';  
import { CircularProgress, Box } from '@mui/material';

const ProtectedAdminRoute = ({ children }) => {
  const { state } = useContext(AdminContext); 
  const adminLogin = state?.adminLogin || {};
  const { adminInfo } = adminLogin;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('adminInfo:', adminInfo);
    // اینجا باید بررسی کنیم که چه زمانی loading باید false شود
    if (adminInfo !== undefined) {
      setLoading(false);
    }
  }, [adminInfo]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // بررسی نقش کاربر و نمایش کامپوننت یا هدایت به صفحه ورود
  // بهتر است از یک شرط دقیق‌تر استفاده کنیم
  if (adminInfo && adminInfo.isAdmin) {
    return children;
  } else {
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedAdminRoute;
