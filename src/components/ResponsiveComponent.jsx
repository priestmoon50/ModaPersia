import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const ResponsiveBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1), // تنظیم padding پایه برای تمامی سایزها
  backgroundColor: theme.palette.background.default, // استفاده از رنگ پس‌زمینه پیش‌فرض تم

  // تغییرات براساس breakpoints
  [theme.breakpoints.up('xs')]: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.light, // استفاده از رنگ‌های موجود در پالت تم
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.secondary.light,
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(5),
    backgroundColor: theme.palette.info.light,
  },
}));

const ResponsiveComponent = () => {
  return (
    <ResponsiveBox>
      <Typography variant="h4" component="h1">
        Responsive Component
      </Typography>
      <Typography variant="body1">
        This component adjusts its padding and background color based on the screen size.
      </Typography>
    </ResponsiveBox>
  );
};

export default ResponsiveComponent;
