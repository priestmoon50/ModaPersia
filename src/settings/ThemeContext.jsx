import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useLanguage } from './LanguageContext';

// ساختار ThemeContext
const ThemeContext = createContext();

// تعریف تم‌ها بر اساس زبان‌های مختلف
const themes = {
  en: {
    light: createTheme({
      palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
      },
      typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
      },
      breakpoints: { /* مقادیر نقاط شکست */ },
    }),
    dark: createTheme({
      palette: {
        mode: 'dark',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
      },
      typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
      },
      breakpoints: { /* مقادیر نقاط شکست */ },
    }),
  },
  fa: {
    light: createTheme({
      palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
      },
      typography: {
        fontFamily: 'Vazirmatn, Arial, sans-serif',
      },
      breakpoints: { /* مقادیر نقاط شکست */ },
    }),
    dark: createTheme({
      palette: {
        mode: 'dark',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
      },
      typography: {
        fontFamily: 'Vazirmatn, Arial, sans-serif',
      },
      breakpoints: { /* مقادیر نقاط شکست */ },
    }),
  },
  zh: {
    light: createTheme({
      palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
      },
      typography: {
        fontFamily: 'Noto Sans SC, Arial, sans-serif',
      },
      breakpoints: { /* مقادیر نقاط شکست */ },
    }),
    dark: createTheme({
      palette: {
        mode: 'dark',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
      },
      typography: {
        fontFamily: 'Noto Sans SC, Arial, sans-serif',
      },
      breakpoints: { /* مقادیر نقاط شکست */ },
    }),
  },
  // افزودن زبان‌های دیگر به همین ترتیب
};

// کامپوننت ThemeProviderWrapper
export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState('light');
  const { language } = useLanguage();

  // تغییر حالت تم (روشن/تاریک)
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // استفاده از useMemo برای ایجاد تم بر اساس زبان و حالت فعلی
  const theme = useMemo(() => {
    const selectedTheme = themes[language] || themes.en; // تم پیش‌فرض در صورت عدم وجود زبان
    return selectedTheme[mode];
  }, [language, mode]);

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
