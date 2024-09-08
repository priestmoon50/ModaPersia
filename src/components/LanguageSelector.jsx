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
      <MenuItem value="fr">Français</MenuItem>  {/* اضافه کردن زبان فرانسوی */}
      <MenuItem value="it">Italiano</MenuItem>  {/* اضافه کردن زبان ایتالیایی */}
      <MenuItem value="es">Español</MenuItem>  {/* اضافه کردن زبان اسپانیایی */}
      <MenuItem value="jp">日本語</MenuItem>  {/* اضافه کردن زبان ژاپنی */}
      <MenuItem value="pt">Português</MenuItem>  {/* اضافه کردن زبان پرتغالی */}
    </Select>
  );
};  

export default LanguageSelector;
