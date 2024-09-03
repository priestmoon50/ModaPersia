import { createTheme } from '@mui/material/styles';

// تعریف تنظیمات مشترک برای تایپوگرافی
const commonTypography = {
  fontFamily: 'Roboto, Arial, sans-serif',
  h1: { fontSize: '2rem' },
  h2: { fontSize: '1.75rem' },
  h3: { fontSize: '1.5rem' },
  body1: { fontSize: '1rem' },
  body2: { fontSize: '0.875rem' },
};

// تعریف تنظیمات مشترک برای پالت رنگی
const commonPalette = {
  primary: {
    main: '#1976d2',
  },
  secondary: {
    main: '#dc004e',
  },
};

// تم‌ها برای زبان‌های مختلف
const themes = {
  en: {
    light: createTheme({
      palette: {
        mode: 'light',
        ...commonPalette,  // استفاده از پالت مشترک
        background: {
          default: '#f5f5f5', // رنگ پس‌زمینه پیش‌فرض
          paper: '#ffffff',   // رنگ پس‌زمینه اجزا
        },
        text: {
          primary: '#000000', // رنگ متن اصلی
          secondary: '#555555', // رنگ متن ثانویه
        },
      },
      typography: {
        ...commonTypography, // استفاده از تایپوگرافی مشترک
      },
      spacing: 8, // تنظیم فاصله‌دهی پایه
    }),
    dark: createTheme({
      palette: {
        mode: 'dark',
        ...commonPalette,  // استفاده از پالت مشترک
        background: {
          default: '#121212', // رنگ پس‌زمینه پیش‌فرض در حالت تاریک
          paper: '#1d1d1d',   // رنگ پس‌زمینه اجزا در حالت تاریک
        },
        text: {
          primary: '#ffffff', // رنگ متن اصلی در حالت تاریک
          secondary: '#aaaaaa', // رنگ متن ثانویه در حالت تاریک
        },
      },
      typography: {
        ...commonTypography, // استفاده از تایپوگرافی مشترک
      },
      spacing: 8, // تنظیم فاصله‌دهی پایه
    }),
  },
  fa: {
    light: createTheme({
      palette: {
        mode: 'light',
        ...commonPalette,
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#000000',
          secondary: '#555555',
        },
      },
      typography: {
        fontFamily: 'Vazirmatn, Arial, sans-serif', // تایپوگرافی مخصوص زبان فارسی
        ...commonTypography,
      },
      spacing: 8,
    }),
    dark: createTheme({
      palette: {
        mode: 'dark',
        ...commonPalette,
        background: {
          default: '#121212',
          paper: '#1d1d1d',
        },
        text: {
          primary: '#ffffff',
          secondary: '#aaaaaa',
        },
      },
      typography: {
        fontFamily: 'Vazirmatn, Arial, sans-serif',
        ...commonTypography,
      },
      spacing: 8,
    }),
  },
  // اضافه کردن زبان‌های دیگر به همین ترتیب
};

export default themes;
