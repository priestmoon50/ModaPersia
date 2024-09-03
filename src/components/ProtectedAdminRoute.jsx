import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from './store/AdminContext';  // تغییر از StoreContext به AdminContext
import { CircularProgress, Box } from '@mui/material';

const ProtectedAdminRoute = ({ children }) => {
  const { state } = useContext(AdminContext);  // استفاده از AdminContext
  const adminLogin = state?.adminLogin || {};  // اطمینان از اینکه adminLogin همیشه یک شیء است
  const { adminInfo } = adminLogin;  // استخراج adminInfo

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('adminInfo:', adminInfo); // اضافه کردن لاگ
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
  return adminInfo && adminInfo.isAdmin ? (
    children
  ) : (
    <Navigate to="/admin/login" replace />
  );
};


export default ProtectedAdminRoute;
