import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom"; // برای هدایت کاربر به صفحه ورود

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const userInfo = localStorage.getItem("userInfo");

      if (!userInfo) {
        navigate("/login"); // هدایت به صفحه ورود اگر کاربر لاگین نکرده باشد
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
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleAddToFavorites = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((product) => product._id !== productId)
    );
  };

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
