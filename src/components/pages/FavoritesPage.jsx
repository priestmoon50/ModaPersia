import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data } = await axios.get("/api/users/favorites");
      setFavorites(data);
    };

    fetchFavorites();
  }, []);

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
            handleAddToFavorites={""}
          />
        ))
      )}
    </div>
  );
};
 
export default FavoritesPage;
