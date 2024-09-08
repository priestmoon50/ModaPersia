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
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { useTheme } from "../settings/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import CartContext from "./store/CartContext";
import { UserContext } from "./store/UserContext";

const Navbar = () => {
  const { state, logoutUser } = useContext(UserContext);
  const { cartCount } = useContext(CartContext);
  const { userLogin } = state;
  const user = userLogin?.userInfo;

  const { toggleTheme, mode } = useTheme();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    console.log("User status changed:", user);
  }, [user]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileNavigate = (path) => {
    handleProfileMenuClose();
    navigate(path);
  };

  const renderAdminLinks = () => (
    <>
      <MenuItem component={Link} to="/admin/products">
        Manage Products
      </MenuItem>
      <MenuItem component={Link} to="/admin/orders">
        Manage Orders
      </MenuItem>
      <MenuItem component={Link} to="/admin/add-product">
        Add Product
      </MenuItem>
    </>
  );

  return (
    <AppBar
      position="static"
      sx={{
        mb: 2,
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "12px",
        padding: "0.5rem 1rem",
        color: mode === "dark" ? "#f8bbd0" : "#8e24aa",
      }}
    >
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

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {isAdmin && renderAdminLinks()}
            <Button
              color="inherit"
              component={Link}
              to="/products"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#e91e63",
                },
              }}
            >
              {t("products")}
            </Button>

            {user ? (
              <>
                {/* دکمه پروفایل با منوی کشویی */}
                <IconButton
                  color="inherit"
                  onClick={handleProfileMenuClick}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#e91e63",
                    },
                  }}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  sx={{
                    "& .MuiPaper-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <MenuItem onClick={() => handleProfileNavigate("/profile")}>
                    Update Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleProfileNavigate("/favorites")}>
                    Favorite List
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>

                <IconButton
                  component={Link}
                  to="/cart"
                  color="inherit"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#e91e63",
                    },
                  }}
                >
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#e91e63",
                    },
                  }}
                >
                  {t("login")}
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#e91e63",
                    },
                  }}
                >
                  {t("register")}
                </Button>
              </>
            )}

            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            <LanguageSelector />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
