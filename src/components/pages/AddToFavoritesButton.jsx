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

        // بررسی اینکه آیا `data` وجود دارد و آیا محصول در لیست علاقه‌مندی‌ها هست یا نه
        if (data && Array.isArray(data)) {
          const isProductFavorite = data.some((favorite) => favorite._id === productId);
          setIsFavorite(isProductFavorite);
        } else {
          console.error('Invalid data format received from /api/favorites');
        }
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

      console.log('Product ID being toggled:', productId); // Log the productId

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
