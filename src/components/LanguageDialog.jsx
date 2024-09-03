// components/LanguageDialog.jsx
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Select, MenuItem } from '@mui/material';
import { useLanguage } from '../settings/LanguageContext';

const LanguageDialog = ({ open, onClose }) => {
  const { changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleConfirm = () => {
    changeLanguage(selectedLanguage);
    onClose();
  };
 
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Language</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please select your preferred language.
        </DialogContentText>
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          fullWidth
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LanguageDialog;
