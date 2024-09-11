import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // تابع برای fetch کردن علاقه‌مندی‌ها
  const fetchFavorites = useCallback(async () => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) {
      navigate("/login"); // هدایت به صفحه ورود اگر کاربر لاگین نکرده باشد
      return;
    }

    // چک کردن کش در localStorage
    const cachedFavorites = localStorage.getItem("favorites");
    if (cachedFavorites) {
      setFavorites(JSON.parse(cachedFavorites));
      setLoading(false);
      return;
    }

    try {
      const token = JSON.parse(userInfo).token;
      const { data } = await axios.get("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setFavorites(data);
      localStorage.setItem("favorites", JSON.stringify(data)); // کش کردن علاقه‌مندی‌ها
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // مدیریت تلاش مجدد (retry) در صورت بروز خطا
  const retryFetchFavorites = useCallback(() => {
    setError(null); // ریست کردن خطا
    setLoading(true);
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // تابع مدیریت حذف علاقه‌مندی‌ها
  const handleAddToFavorites = (productId) => {
    const updatedFavorites = favorites.filter((product) => product._id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // بروزرسانی کش
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Failed to fetch favorites: {error}</p>
        <button onClick={retryFetchFavorites}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>No products in your favorites list.</p>
      ) : (
        favorites.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            handleAddToFavorites={handleAddToFavorites}
          />
        ))
      )}
    </div>
  );
};

export default FavoritesPage;
