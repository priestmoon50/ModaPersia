import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// ساختار ThemeContext
const ThemeContext = createContext();

// استایل‌های عمومی برای حالت شیشه‌ای
const glassEffect = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '12px',
};

// تعریف تم‌ها با هماهنگی بیشتر
const themes = {
  light: createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#007aff' }, // آبی شفاف‌تر برای هماهنگی بهتر
      secondary: { main: '#ff2d55' }, // قرمز پرانرژی برای تاکید بیشتر
      background: {
        default: 'rgba(245, 245, 245, 0.8)', // پس‌زمینه روشن‌تر و شفاف‌تر
        paper: 'rgba(255, 255, 255, 0.5)', // کارت‌ها شیشه‌ای
      },
      text: {
        primary: '#1a1a1a', // متن تیره‌تر برای خوانایی بهتر
        secondary: '#333333', // متن ثانویه کمی روشن‌تر
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: glassEffect, // اعمال افکت شیشه‌ای روی کارت‌ها
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            ...glassEffect,
            backgroundColor: 'rgba(255, 255, 255, 0.3)', // کمی شفاف‌تر برای نوار اپلیکیشن
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px', // دکمه‌های گردتر برای هماهنگی بیشتر
            textTransform: 'none', // عدم استفاده از حروف بزرگ برای دکمه‌ها
          },
        },
      },
    },
  }),
  dark: createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#90caf9' }, // آبی روشن برای حالت شب
      secondary: { main: '#f48fb1' }, // صورتی روشن برای حالت شب
      background: {
        default: 'rgba(18, 18, 18, 0.9)', // پس‌زمینه تیره‌تر و شفافیت کمتر
        paper: 'rgba(28, 28, 28, 0.7)', // کارت‌ها شیشه‌ای و تاریک‌تر
      },
      text: {
        primary: '#ffffff', // متن روشن برای خوانایی بهتر در حالت تاریک
        secondary: '#e0e0e0', // متن ثانویه کمی روشن‌تر
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: '#e0e0e0', // متن اصلی در حالت شب روشن‌تر
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            ...glassEffect,
            background: 'rgba(28, 28, 28, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)', // سایه تیره‌تر
            border: '1px solid rgba(255, 255, 255, 0.2)', // کنتراست بیشتر برای مرزها
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            ...glassEffect,
            backgroundColor: 'rgba(28, 28, 28, 0.4)', // نوار اپلیکیشن شفاف و تیره‌تر
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            color: '#ffffff', // دکمه‌ها با متن سفید
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)', // افکت hover با کنتراست بهتر
            },
          },
        },
      },
    },
  }),
};

// کامپوننت ThemeProviderWrapper
export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState('light');

  // تغییر حالت تم (روشن/تاریک)
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // استفاده از useMemo برای بهبود کارایی و ایجاد تم بر اساس حالت فعلی
  const theme = useMemo(() => themes[mode], [mode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* تنظیمات پیش‌فرض برای استایل‌ها */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// هوک سفارشی برای دسترسی به ThemeContext
export const useTheme = () => useContext(ThemeContext);
