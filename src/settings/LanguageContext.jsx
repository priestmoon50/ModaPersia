import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from './i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // گرفتن زبان ذخیره شده در localStorage یا زبان مرورگر یا استفاده از زبان پیش‌فرض
  const initialLanguage = localStorage.getItem('language') || navigator.language.split('-')[0] || 'en';
  const [language, setLanguage] = useState(initialLanguage);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang); // ذخیره زبان انتخابی در localStorage
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    i18n.changeLanguage(language); // اطمینان از تغییر زبان در i18n
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
