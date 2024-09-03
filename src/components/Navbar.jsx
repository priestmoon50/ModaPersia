import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTheme } from "../settings/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

import { UserContext } from "./store/UserContext"; // Import UserContext

const Navbar = () => {
  const { state, logoutUser } = useContext(UserContext); // Use UserContext instead of StoreContext
  const { cart, userLogin } = state; // گرفتن وضعیت سبد خرید و کاربر
  const cartItems = cart?.cartItems || [];
  const user = userLogin?.userInfo;

  const { toggleTheme, mode } = useTheme();
  const { t } = useTranslation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    // هر بار که user تغییر می‌کند، این تابع اجرا می‌شود
    console.log("User status changed:", user);
  }, [user]); // وابستگی به user

  // مدیریت باز و بسته شدن Drawer
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // مدیریت خروج از حساب کاربری
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const renderAdminLinks = () => (
    <>
      <ListItem button component={Link} to="/admin/products">
        <ListItemText primary="Manage Products" />
      </ListItem>
      <ListItem button component={Link} to="/admin/orders">
        <ListItemText primary="Manage Orders" />
      </ListItem>
      <ListItem button component={Link} to="/admin/add-product">
        <ListItemText primary="Add Product" />
      </ListItem>
    </>
  );

  // لینک‌های مربوط به ورود و خروج کاربر را رندر می‌کند
  const renderAuthLinks = () => (
    <>
      {user ? (
        <>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem
            button
            component={Link}
            to="/login"
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={t("login")} />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/register"
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={t("register")} />
          </ListItem>
        </>
      )}
    </>
  );

  // محتوای Drawer برای نمایش در حالت موبایل
  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <IconButton onClick={handleDrawerToggle}>
        <CloseIcon />
      </IconButton>
      <List>
        <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
          <ListItemText primary={t("welcome")} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/products"
          onClick={handleDrawerToggle}
        >
          <ListItemText primary={t("products")} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/cart"
          onClick={handleDrawerToggle}
        >
          <Badge badgeContent={cartItems.length} color="secondary">
            <ListItemText primary={t("cart")} />
          </Badge>
        </ListItem>
        {isAdmin && renderAdminLinks()}
        {renderAuthLinks()}
        <ListItem button onClick={toggleTheme}>
          <ListItemText
            primary={mode === "dark" ? t("Light Mode") : t("Dark Mode")}
          />
        </ListItem>
        <ListItem>
          <LanguageSelector />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* دکمه باز کردن منو برای صفحه‌های کوچک */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* عنوان اصلی */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
          >
            {t("welcome")}
          </Typography>

          {/* لینک‌ها و دکمه‌ها برای صفحه‌های بزرگ‌تر */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {isAdmin && renderAdminLinks()}
            <Button color="inherit" component={Link} to="/products">
              {t("products")}
            </Button>
            {user ? (
              <>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  {t("login")}
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  {t("register")}
                </Button>
              </>
            )}
            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={cartItems.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <LanguageSelector />
          </Box>
        </Toolbar>
      </Container>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
