import React, { useState, useEffect } from "react";
import { Container, Typography, Box, ButtonBase, Button } from "@mui/material";
import { Link } from "react-router-dom";
import HomeBG1 from "./HomeBG1.png"; // اولین عکس بک‌گراند
import HomeBG2 from "./HomeBG2.png"; // دومین عکس بک‌گراند
import HomeBG3 from "./HomeBG3.png"; // سومین عکس بک‌گراند
import MantouImage from "./mantou.png"; // عکس مربوط به مانتو
import PantsImage from "./pants.png"; // عکس مربوط به شلوار
import ShoesImage from "./shoes.png"; // عکس مربوط به کفش
import NewArrivalsImage from "./newarrivals.png"; // عکس مربوط به جدیدترین‌ها

const HomePage = () => {
  const images = [HomeBG1, HomeBG2, HomeBG3]; // آرایه‌ای از عکس‌ها
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // برای تغییر خودکار بک‌گراند هر ۵ ثانیه
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // هر ۵ ثانیه یکبار تغییر بک‌گراند
    return () => clearInterval(interval); // پاک کردن تایمر در هنگام خروج از کامپوننت
  }, [images.length]);

  return (
    <>
      {/* بخش مربوط به بک‌گراند */}
      <Box
        sx={{
          height: { xs: "30vh", md: "40vh" }, // ریسپانسیو برای ارتفاع بک‌گراند
          width: "100%",
          backgroundImage: `url(${images[currentImageIndex]})`, // نمایش عکس فعلی
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "background-image 1s ease-in-out", // انیمیشن آرام برای تغییر بک‌گراند
          overflow: "hidden",
        }}
      />

      {/* بخش مربوط به دسته‌بندی محصولات با تصاویر دایره‌ای */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around", // فاصله بین دکمه‌ها
          alignItems: "center",
          flexWrap: "wrap", // برای ریسپانسیو بودن دکمه‌ها
          mt: 4, // فاصله از بخش بک‌گراند
        }}
      >
        {/* دکمه برای مانتو */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <ButtonBase
            component={Link}
            to="/products/category/manto"
            sx={{
              width: { xs: 100, md: 120 }, // ریسپانسیو
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

        {/* دکمه برای شلوار */}
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

        {/* دکمه برای کفش */}
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

        {/* دکمه برای جدیدترین‌ها */}
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

      {/* بخش جداگانه برای محتوای اصلی */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4, // فاصله از دسته‌بندی محصولات
        }}
      >
        <Container
          maxWidth="sm" // محدود کردن عرض کانتینر
          sx={{
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // زمینه نیمه شفاف
            backdropFilter: "blur(10px)", // تم شیشه‌ای
            p: 4,
            borderRadius: "16px",
            color: "white",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: { xs: "2rem", md: "2.5rem" } }} // ریسپانسیو
          >
            This is ModaPersia
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ mb: 4, fontSize: { xs: "0.9rem", md: "1rem" } }} // اندازه متن کوچکتر برای ریسپانسیو بودن
          >
            Discover the finest collections and latest trends.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              px: 4, // کمی کوچکتر کردن padding
              py: 1.2,
              fontSize: "1rem",
              borderRadius: "30px",
              textTransform: "none",
              transition: "all 0.3s ease",
              backgroundColor: "secondary.main",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 8px 20px rgba(255, 64, 129, 0.5)",
              },
            }}
          >
            Shop Now
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
