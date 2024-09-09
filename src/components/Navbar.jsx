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
  Drawer,
  List,
  ListItem,
  ListItemText,
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
  const { cartItems } = useContext(CartContext); // تغییر: گرفتن cartItems از context
  const { userLogin } = state;
  const user = userLogin?.userInfo;

  const { toggleTheme, mode } = useTheme();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin || false;

  // محاسبه تعداد کل آیتم‌ها در سبد خرید
  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity, // تعداد کل آیتم‌ها
    0
  );

  useEffect(() => {
    console.log("User status changed:", user);
  }, [user]);

  // مدیریت اسکرول هنگام باز و بسته شدن Drawer
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden"; // جلوگیری از اسکرول صفحه
    } else {
      document.body.style.overflow = "auto"; // بازگرداندن اسکرول
    }

    return () => {
      document.body.style.overflow = "auto"; // اطمینان از بازگرداندن اسکرول هنگام unmount
    };
  }, [drawerOpen]);

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

  const renderDrawerContent = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <List>
        <ListItem button component={Link} to="/products">
          <ListItemText primary={t("products")} />
        </ListItem>
        {user ? (
          <>
            <ListItem button component={Link} to="/profile">
              <ListItemText primary={t("profile")} />
            </ListItem>
            <ListItem button component={Link} to="/favorites">
              <ListItemText primary={t("favorites")} />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary={t("logout")} />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary={t("login")} />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary={t("register")} />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        mb: 2,
        background:
          mode === "dark"
            ? "rgba(18, 18, 18, 0.9)"
            : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(15px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        padding: "0.5rem 1rem",
        color: mode === "dark" ? "#ffffff" : "#000000",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              flexGrow: 1,
              "&:hover": {
                color: mode === "dark" ? "#90caf9" : "#1976d2",
              },
            }}
          >
            Welcome to ModaPersia
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
                  color: mode === "dark" ? "#ff4081" : "#1976d2",
                },
              }}
            >
              {t("products")}
            </Button>

            {user ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleProfileMenuClick}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: mode === "dark" ? "#ff4081" : "#1976d2",
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
                      backgroundColor:
                        mode === "dark"
                          ? "rgba(28, 28, 28, 0.9)"
                          : "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      color: mode === "dark" ? "#ffffff" : "#000000",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                      borderRadius: "12px",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => handleProfileNavigate("/profile")}
                    sx={{
                      color: mode === "dark" ? "#ffffff" : "#000000",
                    }}
                  >
                    Update Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleProfileNavigate("/favorites")}
                    sx={{
                      color: mode === "dark" ? "#ffffff" : "#000000",
                    }}
                  >
                    Favorite List
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: mode === "dark" ? "#ffffff" : "#000000",
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>

                <IconButton
                  component={Link}
                  to="/cart"
                  color="inherit"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: mode === "dark" ? "#ff4081" : "#1976d2",
                    },
                  }}
                >
                  <Badge badgeContent={totalItemsInCart} color="secondary"> {/* تعداد آیتم‌های سبد */}
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
                      color: mode === "dark" ? "#ff4081" : "#1976d2",
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
                      color: mode === "dark" ? "#ff4081" : "#1976d2",
                    },
                  }}
                >
                  {t("register")}
                </Button>
              </>
            )}

            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <LanguageSelector />
          </Box>
        </Toolbar>
      </Container>

      {/* Drawer component for mobile menu */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {renderDrawerContent()}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
