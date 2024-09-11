import React, { useState, useEffect, useContext } from "react";
import { Container, Typography, Box, ButtonBase} from "@mui/material";
import { Link } from "react-router-dom";
import Slider from "react-slick";  // کتابخانه برای اسلایدر
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

const HomePage = () => {
  const images = [HomeBG1, HomeBG2, HomeBG3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);  // استفاده از currentImageIndex
  const { state: productContextState, fetchProducts } = useContext(ProductContext);
  const { products = [] } = productContextState.productList || {};

  // تنظیمات اسلایدر اصلی
  const mainSliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,  // تعداد محصولات در هر ردیف
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

  useEffect(() => {
    fetchProducts(); // گرفتن محصولات هنگام لود کامپوننت
  }, [fetchProducts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);  // تغییر بک‌گراند
    }, 5000);
    return () => clearInterval(interval);  // پاک کردن تایمر
  }, [images.length]);

  return (
    <>
      {/* بخش مربوط به بک‌گراند */}
      <Box
        sx={{
          height: { xs: "30vh", md: "40vh" }, // ریسپانسیو برای ارتفاع بک‌گراند
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
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <ButtonBase
            component={Link}
            to="/products/category/manto"
            sx={{
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              borderRadius: "50%",
              overflow: "hidden",
              display: "block",
            }}
          >
            <img
              src={MantouImage}
              alt="Mantou"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </ButtonBase>
          <Typography mt={1}>Mantou (مانتو)</Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <ButtonBase
            component={Link}
            to="/products/category/pants"
            sx={{
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              borderRadius: "50%",
              overflow: "hidden",
              display: "block",
            }}
          >
            <img
              src={PantsImage}
              alt="Pants"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </ButtonBase>
          <Typography mt={1}>Pants (شلوار)</Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <ButtonBase
            component={Link}
            to="/products/category/shoes"
            sx={{
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              borderRadius: "50%",
              overflow: "hidden",
              display: "block",
            }}
          >
            <img
              src={ShoesImage}
              alt="Shoes"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </ButtonBase>
          <Typography mt={1}>Shoes (کفش)</Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <ButtonBase
            component={Link}
            to="/products/category/newarrivals"
            sx={{
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              borderRadius: "50%",
              overflow: "hidden",
              display: "block",
            }}
          >
            <img
              src={NewArrivalsImage}
              alt="New Arrivals"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </ButtonBase>
          <Typography mt={1}>New Arrivals (جدیدترین‌ها)</Typography>
        </Box>
      </Box>

      {/* بخش نمایش محصولات به صورت اسلایدر اصلی */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Featured Products
        </Typography>
        <Container maxWidth="lg">
          <Slider {...mainSliderSettings}>
            {products.map((product, index) => (
              <Box key={index} px={2}>
                <ProductCard product={product} />
              </Box>
            ))}
          </Slider>
        </Container>
      </Box>

      {/* بخش نمایش محصولات به صورت اسلایدر دوم */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          More Products
        </Typography>
        <Container maxWidth="lg">
          <Slider {...secondSliderSettings}>
            {products.slice(8, 16).map((product, index) => (  // محصولات مختلف در اسلایدر دوم
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
