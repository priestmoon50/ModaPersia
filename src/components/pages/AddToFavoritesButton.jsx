import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

const AddToFavoritesButton = ({ productId }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const userInfo = localStorage.getItem('userInfo');

      if (!userInfo) {
        return;
      }

      try {
        const token = JSON.parse(userInfo).token;

        const { data } = await axios.get(`/api/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // بررسی اینکه آیا این محصول در لیست علاقه‌مندی‌ها هست یا نه
        const isProductFavorite = data.items.some((favorite) => favorite._id === productId);
        setIsFavorite(isProductFavorite);
      } catch (error) {
        console.error('Failed to fetch favorites', error);
      }
    };

    fetchFavoriteStatus();
  }, [productId]);

  const handleFavoritesToggle = async () => {
    const userInfo = localStorage.getItem('userInfo');

    if (!userInfo) {
      window.location.href = '/login';
      return;
    }

    try {
      const token = JSON.parse(userInfo).token;

      if (isFavorite) {
        // حذف از لیست علاقه‌مندی‌ها
        await axios.delete(`/api/favorites/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(false);
        alert('Product removed from favorites');
      } else {
        // اضافه کردن به لیست علاقه‌مندی‌ها
        await axios.post(`/api/favorites`, { productId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(true);
        alert('Product added to favorites');
      }
    } catch (error) {
      console.error(`Failed to ${isFavorite ? 'remove' : 'add'} product to favorites`, error);
      alert(`Failed to ${isFavorite ? 'remove' : 'add'} product to favorites`);
    }
  };

  return (
    <IconButton onClick={handleFavoritesToggle} color={isFavorite ? 'error' : 'default'}>
      <FavoriteIcon />
    </IconButton>
  );
};

export default AddToFavoritesButton;
