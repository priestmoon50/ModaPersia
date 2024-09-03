import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './store/UserContext'; // Import UserContext
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { state, dispatch } = useContext(UserContext); // Use UserContext instead of StoreContext
  const { userInfo } = state.userLogin;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      // تلاش برای بارگذاری اطلاعات کاربر از localStorage
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (storedUserInfo && storedUserInfo.token) {
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: storedUserInfo });
      }
    }
    setLoading(false);
  }, [userInfo, dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return userInfo ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
