import React, { useState} from 'react';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

const AddToFavoritesButton = ({ productId }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // درخواست‌های مربوط به favorite را موقتاً کامنت کنید
  /*
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`/api/favorites/${productId}`);
        // مدیریت وضعیت favorite
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      }
    };

    fetchFavorites();
  }, [productId]);
  */

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
