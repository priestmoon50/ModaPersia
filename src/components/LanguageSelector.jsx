// components/LanguageSelector.jsx
import React from 'react';
import { useLanguage } from '../settings/LanguageContext';
import { MenuItem, Select } from '@mui/material';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <Select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      displayEmpty
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="fa">فارسی</MenuItem>
      <MenuItem value="de">Deutsch</MenuItem>
      <MenuItem value="nl">Nederlands</MenuItem>
      <MenuItem value="ru">Русский</MenuItem>
      <MenuItem value="pl">Polski</MenuItem>
      <MenuItem value="zh">中文</MenuItem>
      <MenuItem value="uk">Українська</MenuItem>
      <MenuItem value="tr">Türkçe</MenuItem>
    </Select>
  );
};  

export default LanguageSelector;
