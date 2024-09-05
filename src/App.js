import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import ProductPage from "./components/pages/ProductPage";
import ProductDetail from "./components/pages/ProductDetail";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm/CheckoutForm";
import OrderConfirmation from "./components/OrderConfirmation";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import ResponsiveComponent from "./components/ResponsiveComponent";
import LanguageDialog from "./components/LanguageDialog";
import { Container } from "@mui/material";
import AdminLoginPage from "./components/admin/AdminLoginPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderTracking from "./components/OrderTracking";
import AdminRoutes from "./components/admin/AdminRoutes";
import { StoreProvider } from "./components/store/StoreContext";
import { CartProvider } from "./components/store/CartContext"; // اضافه کردن CartProvider
import { ProductProvider } from "./components/store/ProductContext";
import { UserProvider } from "./components/store/UserContext";
import { AdminProvider } from "./components/store/AdminContext";  // اضافه کردن AdminProvider
import Footer from "./components/pages/Footer";
import FAQ from "./components/pages/FAQ";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";


// تنظیم Stripe با کلید عمومی
const stripePromise = loadStripe(
  "pk_test_51PiF5WRvkXoEKkvIo1ct4mMniCuiXDEOLYkhcrSdGPEksvSH2y4daVE1x6eWQGQh9R3bc08ILl6m9vQyTr1tC8fB00JH4O8lUu"
);

const App = () => {
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);

  useEffect(() => {
    const hasSeenLanguageDialog = localStorage.getItem("hasSeenLanguageDialog");
    if (!hasSeenLanguageDialog) {
      setLanguageDialogOpen(true);
      localStorage.setItem("hasSeenLanguageDialog", "true");
    }
  }, []);

  const handleLanguageDialogClose = () => {
    setLanguageDialogOpen(false);
  };

  return (
    <StoreProvider>
      <UserProvider>
        <ProductProvider>
        <CartProvider> 
          <AdminProvider>  {/* اضافه کردن AdminProvider برای پوشش تمام بخش‌های ادمین */}
            <Router>
              <Navbar />
              <Container maxWidth="lg">
                <LanguageDialog
                  open={languageDialogOpen}
                  onClose={handleLanguageDialogClose}
                />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/products" element={<ProductPage />} />
                  <Route path="/responsive" element={<ResponsiveComponent />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route
                    path="/checkout"
                    element={
                      <Elements stripe={stripePromise}>
                        <CheckoutForm />
                      </Elements>
                    }
                  />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/order-tracking" element={<OrderTracking />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedAdminRoute>
                        <AdminRoutes />
                      </ProtectedAdminRoute>
                    }
                  />
                </Routes>
              </Container>
              <Footer />
            </Router>
          </AdminProvider>
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </StoreProvider>
  );
};

export default App;
