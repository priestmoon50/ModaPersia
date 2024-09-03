import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./Dashboard/AdminDashboard";
import AdminOrderList from "./Orders/AdminOrderList";
import AdminProductList from "./AdminProductList";
import CreateProductForm from "../CreateProductForm";
import EditProduct from "./EditProduct";
import OrderDetails from "./Orders/OrderDetails"; // ایمپورت کامپوننت OrderDetails

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/products" element={<AdminProductList />} />
      <Route path="/add-product" element={<CreateProductForm />} /> {/* مسیر جدید برای افزودن محصول */}
      <Route path="/edit-product/:id" element={<EditProduct />} />
      <Route path="/orders" element={<AdminOrderList />} />
      <Route path="/order/:id" element={<OrderDetails />} /> {/* مسیر برای نمایش جزئیات سفارش */}
    </Routes>
  );
};

export default AdminRoutes;
