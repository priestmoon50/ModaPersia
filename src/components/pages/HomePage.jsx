import React, { useState, useEffect, useContext, useCallback } from "react";
import { Container, Typography, Box, ButtonBase } from "@mui/material";
import { Link } from "react-router-dom";
import Slider from "react-slick"; 
import { ProductContext } from "../store/ProductContext";
import ProductCard from "./ProductCard";
import HomeBG1 from "./HomeBG1.png";
import HomeBG2 from "./HomeBG2.png";
import HomeBG3 from "./HomeBG3.png";
import MantouImage from "./mantou.png";
import PantsImage from "./pants.png";
import ShoesImage from "./shoes.png";
import NewArrivalsImage from "./newarrivals.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// lazy loading تصاویر
const LazyImage = ({ src, alt, style }) => {
  return <img loading="lazy" src={src} alt={alt} style={style} />;
};

const HomePage = () => {
  const images = [HomeBG1, HomeBG2, HomeBG3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { state: productContextState, fetchProducts } = useContext(ProductContext);
  const { products = [] } = productContextState.productList || {};
  const [error, setError] = useState(null);

  // تنظیمات اسلایدر اصلی
  const mainSliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // تنظیمات اسلایدر دوم
  const secondSliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // مدیریت fetchProducts با مدیریت خطا
  const loadProducts = useCallback(async () => {
    try {
      await fetchProducts();
    } catch (err) {
      setError("خطا در بارگذاری محصولات. لطفا دوباره تلاش کنید.");
    }
  }, [fetchProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {/* بخش مربوط به بک‌گراند */}
      <Box
        sx={{
          height: { xs: "30vh", md: "40vh" },
          width: "100%",
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "background-image 1s ease-in-out",
          overflow: "hidden",
        }}
      />

      {/* بخش مربوط به دسته‌بندی محصولات */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
          mt: 4,
        }}
      >
        {[
          { src: MantouImage, alt: "Mantou", link: "/products/category/manto", label: "Mantou (مانتو)" },
          { src: PantsImage, alt: "Pants", link: "/products/category/pants", label: "Pants (شلوار)" },
          { src: ShoesImage, alt: "Shoes", link: "/products/category/shoes", label: "Shoes (کفش)" },
          { src: NewArrivalsImage, alt: "New Arrivals", link: "/products/category/newarrivals", label: "New Arrivals (جدیدترین‌ها)" }
        ].map((item, index) => (
          <Box key={index} sx={{ textAlign: "center", mb: 2 }}>
            <ButtonBase
              component={Link}
              to={item.link}
              sx={{
                width: { xs: 100, md: 120 },
                height: { xs: 100, md: 120 },
                borderRadius: "50%",
                overflow: "hidden",
                display: "block",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // افکت سایه
                "&:hover": {
                  transform: "scale(1.05)", // انیمیشن hover
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <LazyImage src={item.src} alt={item.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </ButtonBase>
            <Typography mt={1} variant="subtitle1">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* بخش نمایش محصولات به صورت اسلایدر اصلی */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Featured Products
        </Typography>
        <Container maxWidth="lg">
          {error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : (
            <Slider {...mainSliderSettings}>
              {products.map((product, index) => (
                <Box key={index} px={2}>
                  <ProductCard product={product} />
                </Box>
              ))}
            </Slider>
          )}
        </Container>
      </Box>

      {/* بخش نمایش محصولات به صورت اسلایدر دوم */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          More Products
        </Typography>
        <Container maxWidth="lg">
          <Slider {...secondSliderSettings}>
            {products.slice(8, 16).map((product, index) => (
              <Box key={index} px={2}>
                <ProductCard product={product} />
              </Box>
            ))}
          </Slider>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
